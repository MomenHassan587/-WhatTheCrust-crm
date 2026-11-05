# الصفحة الرئيسية النشطة وفيديو المقدمة

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/Pages/Home.jsx` · 1101 سطر.

**وظيفة الملف:** الفيديو الحالي داخل HeroSection هنا، مش HeroSlider/HeroLanding. Home يعرض featured pizzas من الكتالوج الحقيقي ويضيفها للسلة؛ النص والشريط يظهران بعد 1.2 ثانية من زمن الفيديو مع fallback عند play failure.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../resources/js/Pages/Home.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/context/CatalogContext.jsx](../context/CatalogContext.jsx.md)

- [pizza-crm/resources/js/context/OrderContext.jsx](../context/OrderContext.jsx.md)

- [pizza-crm/resources/js/Pages/Cart.jsx](Cart.jsx.md)

- [pizza-crm/resources/js/Components/Navbar.jsx](../Components/Navbar.jsx.md)

- [pizza-crm/resources/js/app.jsx](../app.jsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
// resources/js/Pages/Home.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { branchOption, useCatalog } from '../context/CatalogContext';
import { useOrder } from '../context/OrderContext';

const CART_STORAGE_KEY = import.meta.env.VITE_DEMO_MODE === 'true' ? 'wtc_demo_cart' : 'wtc_cart';
const CART_EVENT_NAME = 'wtc-cart-updated';

const awards = [
    {
        title: '50 Top Pizza World',
        detail: '2023 - 84th Place',
        label: 'World Ranking',
    },
    {
        title: 'Pioneer in Field Award',
        detail: '2022',
        label: 'Industry Honor',
    },
    {
        title: 'Top Africa',
        detail: '2021',
        label: 'Continental List',
    },
    {
        title: 'Top Ten Neapolitan Pizza Outside Italy',
        detail: '2021',
        label: 'International Top Ten',
    },
];

const textWrap = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const textItem = {
    hidden: {
        opacity: 0,
        y: 18,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: 'easeOut',
        },
    },
};

const heroReveal = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const heroRevealItem = {
    hidden: {
        opacity: 0,
        y: 25,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

const HERO_REVEAL_TIME = 1.2;
const HERO_SLOWDOWN_START = 6;
const HERO_SLOWDOWN_END = 8;
const HERO_MIN_PLAYBACK_RATE = 0.35;

function readCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function writeCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_EVENT_NAME));
}

function LaurelIcon() {
    return (
        <svg width="42" height="42" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M24 50C13 44 8 34 11 20" stroke="#e32424" strokeWidth="3" strokeLinecap="round" />
            <path d="M40 50C51 44 56 34 53 20" stroke="#e32424" strokeWidth="3" strokeLinecap="round" />
            <path d="M16 23C21 23 23 20 24 16C19 15 16 18 16 23Z" fill="#F1A83A" />
            <path d="M14 32C19 31 21 28 21 24C16 24 13 27 14 32Z" fill="#F1A83A" />
            <path d="M18 41C23 39 24 36 23 32C18 33 16 36 18 41Z" fill="#F1A83A" />
            <path d="M48 23C43 23 41 20 40 16C45 15 48 18 48 23Z" fill="#F1A83A" />
            <path d="M50 32C45 31 43 28 43 24C48 24 51 27 50 32Z" fill="#F1A83A" />
            <path d="M46 41C41 39 40 36 41 32C46 33 48 36 46 41Z" fill="#F1A83A" />
            <path d="M24 50H40" stroke="#e32424" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

function HeroSection({ isReady, onReady, reduceMotion }) {
    const videoRef = React.useRef(null);
    const hasRevealedRef = React.useRef(false);

    const revealContent = React.useCallback(() => {
        if (hasRevealedRef.current) return;

        hasRevealedRef.current = true;
        onReady();
    }, [onReady]);

    useEffect(() => {
        let isCurrentPlayback = true;
        let animationFrameId = 0;
        const video = videoRef.current;
        if (!video) {
            revealContent();
            return undefined;
        }

        hasRevealedRef.current = false;
        video.pause();
        video.playbackRate = 1;
        video.currentTime = 0;
        video.load();

        const updatePlayback = () => {
            if (!isCurrentPlayback || video.error) return;

            if (video.currentTime >= HERO_REVEAL_TIME) {
                revealContent();
            }

            if (Number.isFinite(video.duration) && video.duration > 0) {
                const slowdownEnd = Math.min(HERO_SLOWDOWN_END, video.duration);

                if (video.currentTime >= HERO_SLOWDOWN_START && slowdownEnd > HERO_SLOWDOWN_START) {
                    const progress = Math.min(
                        1,
                        (video.currentTime - HERO_SLOWDOWN_START) / (slowdownEnd - HERO_SLOWDOWN_START),
                    );
                    const easedProgress = progress * progress * (3 - (2 * progress));
                    video.playbackRate = 1 - ((1 - HERO_MIN_PLAYBACK_RATE) * easedProgress);
                } else {
                    video.playbackRate = 1;
                }
            }

            if (!video.ended) {
                animationFrameId = window.requestAnimationFrame(updatePlayback);
            }
        };

        animationFrameId = window.requestAnimationFrame(updatePlayback);

        const playPromise = video.play();
        playPromise?.catch(() => {
            if (isCurrentPlayback) {
                revealContent();
                window.cancelAnimationFrame(animationFrameId);
            }
        });

        return () => {
            isCurrentPlayback = false;
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [revealContent]);

    return (
        <section id="home" className="wtc-hero-section">
            <video
                key="hero-intro-video-v2"
                ref={videoRef}
                className="wtc-hero-video object-cover w-100 h-100 position-absolute top-0 start-0"
                src="/videos/hero-pizza-motion.mp4?v=20260930-2"
                muted
                playsInline
                preload="auto"
                onEnded={revealContent}
                onError={revealContent}
                aria-hidden="true"
            />
            <div className="wtc-hero-shade" aria-hidden="true" />

            <AnimatePresence>
                {isReady && (
                    <motion.div
                        className="wtc-hero-overlay"
                        variants={heroReveal}
                        initial={reduceMotion ? false : 'hidden'}
                        animate="visible"
                    >
                        <div className="wtc-hero-main container-fluid">
                            <div className="wtc-hero-copy-stack">
                                <motion.p className="eyebrow" variants={heroRevealItem}>
                                    Authentic. Flame-Baked. Irresistible.
                                </motion.p>

                                <motion.h1 className="wtc-hero-title" variants={heroRevealItem}>
                                    Hot Stone Pizza
                                    <span>Made Fresh Daily</span>
                                </motion.h1>

                                <motion.p className="wtc-hero-description" variants={heroRevealItem}>
                                    Handcrafted pizzas made with premium ingredients, baked to perfection
                                    at intense heat for a blistered crust, rich sauce, and molten cheese.
                                </motion.p>

                                <motion.div
                                    className="wtc-hero-actions d-flex flex-wrap gap-3"
                                    variants={heroRevealItem}
                                >
                                    <Link to="/menu" className="btn btn-red btn-lg">
                                        Order Now
                                    </Link>

                                    <Link to="/menu" className="btn btn-outline-glow btn-lg">
                                        View Menu
                                    </Link>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div className="wtc-hero-stats" variants={heroRevealItem}>
                            <div className="wtc-hero-stats-inner container-fluid row row-cols-1 row-cols-md-3 g-0">
                                <div className="wtc-hero-stat wtc-hero-stat-flame col">
                                    <span aria-hidden="true">&#x1F525;</span>
                                    <strong>Flame-Baked</strong>
                                    <small>Intense heat, bold crust</small>
                                </div>

                                <div className="wtc-hero-stat wtc-hero-stat-fresh col">
                                    <span aria-hidden="true">&#x1F33F;</span>
                                    <strong>Fresh Ingredients</strong>
                                    <small>Sourced daily, always bright</small>
                                </div>

                                <div className="wtc-hero-stat wtc-hero-stat-delivery col">
                                    <span aria-hidden="true">&#x1F6F5;</span>
                                    <strong>Fast Delivery</strong>
                                    <small>Hot, fresh, and on time</small>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

function AwardsSection() {
    return (
        <section className="wtc-awards-section">
            <div className="container">
                <div className="row align-items-end g-4 mb-5 wtc-awards-intro">
                    <div className="col-12 col-lg-7">
                        <p className="eyebrow">Awards & Recognition</p>
                        <h2 className="wtc-section-title">A trophy shelf for the crust.</h2>
                    </div>

                    <div className="col-12 col-lg-5">
                        <p className="wtc-section-copy">
                            A premium crust deserves a proper showcase. These honors bring the
                            brand an authoritative, international glow.
                        </p>
                    </div>
                </div>

                <div className="wtc-awards-showcase">
                    {awards.map((award, index) => (
                        <motion.article
                            className="wtc-award-card"
                            key={`${award.title}-${award.detail}`}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.45, delay: index * 0.08 }}
                        >
                            <div className="wtc-award-glow" aria-hidden="true" />

                            <div className="wtc-award-topline">
                                <span className="wtc-award-rank">0{index + 1}</span>
                                <span className="wtc-award-label">{award.label}</span>
                            </div>

                            <div className="wtc-award-medal">
                                <LaurelIcon />
                            </div>

                            <div>
                                <h3>{award.title}</h3>
                                <p>{award.detail}</p>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HeatVaultSection({ items, loading, onAddToCart }) {
    return (
        <section className="wtc-heat-vault-section">
            <div className="container">
                <div className="text-center mx-auto mb-5" style={{ maxWidth: '760px' }}>
                    <p className="eyebrow">Fresh From The Heat Vault</p>
                    <h2 className="wtc-section-title">Signature slices with serious swagger.</h2>
                    <p className="wtc-section-copy mx-auto">
                        Image-first cards, chef-style details, red prices, and one-tap cart magic.
                    </p>

                    <div className="mt-4">
                        <Link to="/menu" className="btn btn-red btn-lg">
                            View Full Menu
                        </Link>
                    </div>
                </div>

                {loading && <p className="text-center text-secondary" role="status">Loading featured pizzas...</p>}
                {!loading && !items.length && <p className="text-center text-secondary">Featured pizzas are not available right now.</p>}
                <div className="row g-4">
                    {items.map((item, index) => (
                        <div className="col-12 col-md-6 col-xl-3" key={item.id}>
                            <motion.article
                                className="wtc-menu-card"
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.25 }}
                                transition={{ duration: 0.45, delay: index * 0.08 }}
                            >
                                <div className="wtc-menu-card-image">
                                    {item.image_src ? <img src={item.image_src} alt={item.name} loading="lazy" decoding="async" /> : <div className="menu-image-placeholder" role="img" aria-label={`${item.name} photo coming soon`}>WTC</div>}
                                    <span>{item.tag || 'Featured'}</span>
                                </div>

                                <div className="wtc-menu-card-body">
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>

                                    <div className="wtc-menu-card-footer">
                                        <strong>EGP {item.price}</strong>

                                        <button
                                            type="button"
                                            aria-label={`Add ${item.name} to cart`}
                                            onClick={() => onAddToCart(item)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CartToast({ show }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="wtc-cart-toast"
                    initial={{ opacity: 0, y: 22, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 18, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    role="status"
                >
                    <span>✓</span>
                    Added to Cart Successfully!
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function Home({ heroReady, onHeroReady, reduceMotion }) {
    const [showToast, setShowToast] = useState(false);
    const { branches, items, loading } = useCatalog();
    const { branchId, selectedBranch, setBranch } = useOrder();

    const heatVaultItems = useMemo(() => {
        const activeBranchId = branchId || branches[0]?.id;
        const branch = selectedBranch || branches.find((entry) => entry.id === activeBranchId);

        return items
            .filter((item) => item.category_slug === 'pizzas' && branchOption(item, activeBranchId)?.is_available)
            .slice(0, 4)
            .map((item) => ({
                ...item,
                price: Number(branchOption(item, activeBranchId).price),
                image_src: item.image_path,
                branch_id: activeBranchId,
                branch_name: branch?.name,
            }));
    }, [branches, items, branchId, selectedBranch]);

    useEffect(() => {
        if (!showToast) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => {
            setShowToast(false);
        }, 2200);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [showToast]);

    const addToCart = (item) => {
        let currentCart = readCart();
        if (currentCart.some((line) => Number(line.branch_id) !== Number(item.branch_id))) {
            if (!setBranch(item.branch_id)) return;
            currentCart = readCart();
        }
        const existingItem = currentCart.find((cartItem) => cartItem.id === item.id);

        const nextCart = existingItem
            ? currentCart.map((cartItem) => (
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            ))
            : [
                ...currentCart,
                {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image_src: item.image_src,
                    branch_id: item.branch_id,
                    branch_name: item.branch_name,
                    quantity: 1,
                },
            ];

        writeCart(nextCart);
        setShowToast(true);
    };

    return (
        <>
            <style>
                {`
                    .wtc-hero-section {
                        position: relative;
                        min-height: 100svh;
                        overflow: hidden;
                        background: #080808;
                        isolation: isolate;
                    }

                    .wtc-hero-video {
                        position: absolute;
                        inset: 0;
                        z-index: 0;
                        display: block;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        object-position: center;
                        transform: scale(1.12);
                        filter: saturate(1.08) contrast(1.05);
                        pointer-events: none;
                    }

                    .wtc-hero-shade {
                        position: absolute;
                        inset: 0;
                        z-index: 1;
                        pointer-events: none;
                        background:
                            linear-gradient(90deg, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.64) 38%, rgba(5,5,5,0.12) 72%),
                             linear-gradient(180deg, rgba(5,5,5,0.38) 0%, rgba(5,5,5,0.04) 46%, rgba(5,5,5,0.88) 100%);
                    }

                    .wtc-hero-shade::before,
                    .wtc-hero-shade::after {
                        content: "";
                        position: absolute;
                        pointer-events: none;
                    }

                    .wtc-hero-shade::before {
                        top: 0;
                        left: 0;
                        width: clamp(110px, 14vw, 220px);
                        height: clamp(86px, 15vh, 150px);
                        background: radial-gradient(ellipse at top left, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.82) 42%, transparent 76%);
                    }

                    .wtc-hero-shade::after {
                        right: 0;
                        bottom: 0;
                        width: clamp(100px, 13vw, 210px);
                        height: clamp(90px, 16vh, 165px);
                        background: radial-gradient(ellipse at bottom right, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.78) 40%, transparent 76%);
                    }

                    .wtc-hero-overlay {
                        position: relative;
                        z-index: 2;
                        min-height: 100svh;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-end;
                        padding-top: 84px;
                    }

                    .wtc-hero-main {
                        display: flex;
                        flex: 1 1 auto;
                        align-items: center;
                        padding: clamp(2rem, 5vh, 4.5rem) clamp(1.25rem, 5vw, 5.5rem);
                    }

                    .wtc-hero-copy-stack {
                        width: min(680px, 58vw);
                    }

                    .wtc-hero-title {
                        margin: 0 0 1.35rem;
                        font-size: clamp(3rem, 6.2vw, 6.8rem);
                        line-height: 0.88;
                        font-weight: 1000;
                        letter-spacing: 0;
                        color: #F5F5F5;
                        text-shadow: 0 14px 34px rgba(0,0,0,0.54);
                    }

                    .wtc-hero-title span {
                        display: block;
                        color: #e32424;
                    }

                    .wtc-hero-description {
                        max-width: 560px;
                        color: rgba(245,245,245,0.9);
                        font-size: 1rem;
                        line-height: 1.8;
                        text-shadow: 0 8px 24px rgba(0,0,0,0.52);
                    }

                    .wtc-hero-actions {
                        margin: 2rem 0;
                    }

                    .wtc-hero-stats {
                        flex: 0 0 auto;
                        border-top: 1px solid rgba(255,255,255,0.13);
                        background: rgba(7,7,7,0.58);
                        backdrop-filter: blur(14px);
                        -webkit-backdrop-filter: blur(14px);
                    }

                    .wtc-hero-stats-inner {
                        max-width: none;
                        margin: 0;
                        padding: 1.25rem clamp(1.25rem, 5vw, 5.5rem) 1.45rem;
                    }

                    .wtc-hero-stat {
                        min-width: 0;
                        position: relative;
                        padding-right: clamp(1rem, 4vw, 4rem);
                        text-shadow: 0 8px 24px rgba(0,0,0,0.52);
                    }

                    .wtc-hero-stat + .wtc-hero-stat::before {
                        content: "";
                        position: absolute;
                        top: 0.15rem;
                        bottom: 0.15rem;
                        left: 0;
                        width: 1px;
                        background: rgba(255,255,255,0.13);
                    }

                    .wtc-hero-stat + .wtc-hero-stat {
                        padding-left: clamp(1rem, 4vw, 4rem);
                    }

                    .wtc-hero-stat span {
                        display: inline-block;
                        font-size: 1.18rem;
                        line-height: 1;
                    }

                    .wtc-hero-stat strong {
                        display: block;
                        margin-top: 0.25rem;
                        font-size: 0.95rem;
                        line-height: 1.25;
                    }

                    .wtc-hero-stat small {
                        display: block;
                        margin-top: 0.38rem;
                        color: rgba(245,245,245,0.72);
                        font-size: 0.86rem;
                        line-height: 1.55;
                    }

                    .wtc-awards-section,
                    .wtc-heat-vault-section {
                        padding: 6.5rem 0;
                        background:
                            radial-gradient(circle at 82% 4%, rgba(227,38,38,0.08), transparent 28rem),
                            linear-gradient(180deg, #111 0%, #101010 48%, #111 100%);
                    }

                    .wtc-awards-section {
                        position: relative;
                        overflow: hidden;
                    }

                    .wtc-awards-section::before {
                        content: "";
                        position: absolute;
                        inset: 0;
                        pointer-events: none;
                        background:
                            radial-gradient(circle at 50% 38%, rgba(241,168,58,0.14), transparent 18rem),
                            radial-gradient(circle at 90% 0%, rgba(227,38,38,0.14), transparent 28rem);
                        opacity: 0.72;
                    }

                    .wtc-awards-intro,
                    .wtc-awards-showcase {
                        position: relative;
                        z-index: 2;
                    }

                    .wtc-section-title {
                        margin: 0;
                        color: #F5F5F5;
                        font-size: clamp(2.4rem, 4.5vw, 4.8rem);
                        line-height: 0.95;
                        font-weight: 1000;
                        letter-spacing: 0;
                    }

                    .wtc-section-copy {
                        color: rgba(245,245,245,0.66);
                        line-height: 1.8;
                    }

                    .wtc-awards-showcase {
                        display: grid;
                        grid-template-columns: repeat(4, minmax(0, 1fr));
                        gap: 1.1rem;
                        padding-top: 1.2rem;
                    }

                    .wtc-awards-showcase::before {
                        content: "";
                        position: absolute;
                        left: 1.5rem;
                        right: 1.5rem;
                        bottom: -1.25rem;
                        height: 1px;
                        background: linear-gradient(90deg, transparent, rgba(241,168,58,0.5), transparent);
                        box-shadow: 0 22px 60px rgba(241,168,58,0.18);
                    }

                    .wtc-award-card {
                        position: relative;
                        min-height: 280px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        overflow: hidden;
                        padding: 1.25rem;
                        border-radius: 8px;
                        border: 1px solid rgba(241,168,58,0.2);
                        background:
                            linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.018) 52%, rgba(241,168,58,0.06)),
                            #1A1A1A;
                        box-shadow: 0 28px 80px rgba(0,0,0,0.34);
                        transition: transform 0.24s ease, border-color 0.24s ease, box-shadow 0.24s ease;
                    }

                    .wtc-award-card:hover {
                        transform: translateY(-7px);
                        border-color: rgba(241,168,58,0.45);
                        box-shadow: 0 34px 92px rgba(0,0,0,0.44), 0 0 36px rgba(241,168,58,0.08);
                    }

                    .wtc-award-glow {
                        position: absolute;
                        inset: -38% -20% auto;
                        height: 62%;
                        background: radial-gradient(circle, rgba(241,168,58,0.18), transparent 62%);
                        opacity: 0.86;
                        pointer-events: none;
                    }

                    .wtc-award-topline {
                        position: relative;
                        z-index: 2;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 1rem;
                    }

                    .wtc-award-rank {
                        width: fit-content;
                        padding: 0.36rem 0.65rem;
                        border-radius: 999px;
                        background: rgba(227,38,38,0.12);
                        color: #e32424;
                        font-weight: 950;
                        font-size: 0.75rem;
                    }

                    .wtc-award-label {
                        color: rgba(245,245,245,0.54);
                        font-size: 0.68rem;
                        font-weight: 900;
                        letter-spacing: 0.08em;
                        text-transform: uppercase;
                        text-align: right;
                    }

                    .wtc-award-medal {
                        position: relative;
                        z-index: 2;
                        width: 78px;
                        height: 78px;
                        display: grid;
                        place-items: center;
                        margin: 1rem 0 1.6rem;
                        border-radius: 50%;
                        background:
                            radial-gradient(circle at 50% 42%, rgba(241,168,58,0.22), rgba(227,38,38,0.08) 62%, rgba(255,255,255,0.03));
                        box-shadow: inset 0 0 0 1px rgba(241,168,58,0.18), 0 18px 38px rgba(0,0,0,0.28);
                    }

                    .wtc-award-card h3 {
                        margin: 0;
                        color: #F5F5F5;
                        font-size: clamp(1.05rem, 1.3vw, 1.28rem);
                        line-height: 1.25;
                        font-weight: 950;
                        letter-spacing: 0;
                    }

                    .wtc-award-card p {
                        margin: 0.45rem 0 0;
                        color: #F1A83A;
                        font-weight: 900;
                    }

                    .wtc-menu-card {
                        height: 100%;
                        overflow: hidden;
                        border-radius: 8px;
                        border: 1px solid rgba(255,255,255,0.07);
                        background: rgba(26,26,26,0.9);
                        color: #F5F5F5;
                        box-shadow: 0 24px 70px rgba(0,0,0,0.28);
                        transition: transform 0.25s ease, border-color 0.25s ease;
                    }

                    .wtc-menu-card:hover {
                        transform: translateY(-7px);
                        border-color: rgba(227,38,38,0.4);
                    }

                    .wtc-menu-card-image {
                        position: relative;
                        height: 210px;
                        overflow: hidden;
                        background:
                            radial-gradient(circle at 50% 45%, rgba(241,168,58,0.18), transparent 8rem),
                            #101010;
                    }

                    .wtc-menu-card-image img {
                        width: 100%;
                        height: 100%;
                        display: block;
                        object-fit: cover;
                        object-position: center;
                    }

                    .wtc-menu-card-image span {
                        position: absolute;
                        top: 1rem;
                        left: 1rem;
                        z-index: 2;
                        padding: 0.36rem 0.6rem;
                        border-radius: 999px;
                        background: #e32424;
                        color: #ffffff;
                        font-size: 0.68rem;
                        font-weight: 950;
                        text-transform: uppercase;
                        letter-spacing: 0.06em;
                    }

                    .wtc-menu-card-body {
                        padding: 1.2rem;
                    }

                    .wtc-menu-card-body h3 {
                        margin: 0 0 0.7rem;
                        font-size: 1.28rem;
                        line-height: 1.2;
                        font-weight: 950;
                        letter-spacing: 0;
                    }

                    .wtc-menu-card-body p {
                        min-height: 82px;
                        margin: 0;
                        color: rgba(245,245,245,0.62);
                        line-height: 1.65;
                    }

                    .wtc-menu-card-footer {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 1rem;
                        margin-top: 1.2rem;
                    }

                    .wtc-menu-card-footer strong {
                        color: #e32424;
                        font-size: 1.05rem;
                        font-weight: 950;
                    }

                    .wtc-menu-card-footer button {
                        width: 42px;
                        height: 42px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        border: 0;
                        border-radius: 999px;
                        background: #e32424;
                        color: #ffffff;
                        font-size: 1.45rem;
                        font-weight: 900;
                        box-shadow: 0 12px 28px rgba(227,38,38,0.28);
                        transition: 0.22s ease;
                    }

                    .wtc-menu-card-footer button:hover {
                        transform: translateY(-2px) rotate(8deg);
                        background: #ff3838;
                    }

                    .wtc-cart-toast {
                        position: fixed;
                        right: 1.4rem;
                        bottom: 1.4rem;
                        z-index: 3000;
                        display: inline-flex;
                        align-items: center;
                        gap: 0.7rem;
                        padding: 0.95rem 1.1rem;
                        border-radius: 1rem;
                        border: 1px solid rgba(255,255,255,0.1);
                        background: rgba(26,26,26,0.92);
                        color: #F5F5F5;
                        font-weight: 900;
                        box-shadow: 0 24px 70px rgba(0,0,0,0.35);
                        backdrop-filter: blur(14px);
                        -webkit-backdrop-filter: blur(14px);
                    }

                    .wtc-cart-toast span {
                        width: 26px;
                        height: 26px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 999px;
                        background: #e32424;
                        color: #ffffff;
                    }

                    @media (max-width: 1199px) {
                        .wtc-awards-showcase {
                            grid-template-columns: repeat(2, minmax(0, 1fr));
                        }
                    }

                    @media (max-width: 767px) {
                        .wtc-hero-section {
                            min-height: max(100svh, 760px);
                        }

                        .wtc-hero-shade {
                            background:
                                linear-gradient(
                                    180deg,
                                    rgba(5,5,5,0.42) 0%,
                                    rgba(5,5,5,0.12) 28%,
                                    rgba(5,5,5,0.58) 58%,
                                    rgba(5,5,5,0.94) 100%
                                );
                        }

                        .wtc-hero-video {
                            object-position: center;
                        }

                        .wtc-hero-overlay {
                            min-height: max(100svh, 760px);
                            padding-top: 72px;
                        }

                        .wtc-hero-main {
                            align-items: flex-end;
                            padding: 2.25rem 1.2rem 1.6rem;
                        }

                        .wtc-hero-copy-stack {
                            width: 100%;
                            max-width: 590px;
                        }

                        .wtc-hero-title {
                            font-size: clamp(2.8rem, 13.5vw, 4.9rem);
                        }

                        .wtc-hero-description {
                            max-width: 560px;
                        }

                        .wtc-hero-actions {
                            margin: 1.8rem 0;
                        }

                        .wtc-hero-stats {
                            background: rgba(7,7,7,0.72);
                        }

                        .wtc-hero-stats-inner {
                            padding: 0.35rem 1.2rem 1rem;
                        }

                        .wtc-hero-stat {
                            min-width: 0;
                            display: grid;
                            grid-template-columns: 1.75rem 1fr;
                            grid-template-rows: auto auto;
                            align-items: center;
                            padding: 0.7rem 0;
                        }

                        .wtc-hero-stat + .wtc-hero-stat {
                            padding-left: 0;
                            border-top: 1px solid rgba(255,255,255,0.1);
                        }

                        .wtc-hero-stat + .wtc-hero-stat::before {
                            display: none;
                        }

                        .wtc-hero-stat span {
                            grid-row: 1 / 3;
                            font-size: 1.05rem;
                        }

                        .wtc-hero-stat strong {
                            margin-top: 0;
                            font-size: 0.84rem;
                            line-height: 1.25;
                        }

                        .wtc-hero-stat small {
                            margin-top: 0.1rem;
                            font-size: 0.72rem;
                            line-height: 1.35;
                        }

                        .wtc-awards-section,
                        .wtc-heat-vault-section {
                            padding: 4.8rem 0;
                        }
                    }

                    @media (max-width: 575px) {
                        .wtc-hero-title {
                            font-size: clamp(2.65rem, 14vw, 4.2rem);
                        }

                        .wtc-hero-actions {
                            width: 100%;
                        }

                        .wtc-hero-actions .btn {
                            flex: 1 1 calc(50% - 0.75rem);
                        }

                        .wtc-awards-showcase {
                            grid-template-columns: 1fr;
                        }

                        .wtc-cart-toast {
                            left: 1rem;
                            right: 1rem;
                            bottom: 1rem;
                            justify-content: center;
                        }
                    }
                `}
            </style>

            <main>
            <HeroSection
                isReady={heroReady}
                onReady={onHeroReady}
                reduceMotion={reduceMotion}
            />
                <AwardsSection />
                <HeatVaultSection items={heatVaultItems} loading={loading} onAddToCart={addToCart} />

                <section id="about" className="section-padding about-section">
                    <div className="container">
                        <div className="row g-5 align-items-center">
                            <div className="col-12 col-lg-5">
                                <p className="eyebrow">About the Crust</p>
                                <h2 className="section-title">
                                    Pizza with black-shirt confidence.
                                </h2>
                            </div>

                            <div className="col-12 col-lg-7">
                                <p className="section-copy">
                                    What The Crust serves flame-baked pizza, toasted sandwiches,
                                    rich dips, and desserts through a branch-aware ordering system.
                                    Every customer sees the correct prices and availability before checkout.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="contact" className="section-padding contact-section">
                    <div className="container">
                        <div className="contact-strip">
                            <div>
                                <p className="eyebrow">Contact</p>
                                <h2 className="section-title mb-3">Three ovens, one crust.</h2>
                                <p className="section-copy mb-0">
                                    Pick your nearest branch in the footer, order online, or drop in
                                    for a slice baked to perfection at intense heat.
                                </p>
                            </div>

                            <div className="contact-actions">
                                <a href="mailto:hello@WhatTheCrust.com" className="btn btn-red">
                                    Email Us
                                </a>
                                <Link to="/menu" className="btn btn-outline-glow">
                                    Start Order
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <CartToast show={showToast} />
            </main>
        </>
    );
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### readCart

قراءة السلة الحالية مع fallback عند JSON تالف.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** cart أو [].

### writeCart

حفظ السلة والإعلان عن تحديثها.

- **بتاخد إيه؟ Inputs:** cart array.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### LaurelIcon

يرسم أيقونة SVG زينة الجوائز.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX.

### HeroSection

يدير عنصر video بالـ ref ويعرض النص عندما الأب يمرر isReady=true. يبطئ playback تدريجيًا قرب نهاية المقدمة.

- **بتاخد إيه؟ Inputs:** isReady,onReady,reduceMotion.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX video وoverlay.

### revealContent

يمنع تكرار reveal باستخدام ref ثم ينادي onReady من الأب؛ يُستخدم من animation loop وonEnded وonError وplay.catch.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### updatePlayback

Callback لكل animation frame: يراقب currentTime لإظهار النص ويحسب playbackRate بعد الثانية 6 ثم يجدول نفسه ما دام الفيديو لم ينته.

- **بتاخد إيه؟ Inputs:** لا parameters مستخدمة.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ requestAnimationFrame خارجي يعيد رقمًا للتنظيف.

### AwardsSection

يرسم awards الثابتة مع motion أثناء دخولها الشاشة؛ المحتوى ده claims داخل التصميم وليس تحققًا خارجيًا من جوائز.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX.

### HeatVaultSection

يرسم featured cards؛ الزر ينادي onAddToCart(item) اللي وصل من Home، فلا يكتب storage بنفسه.

- **بتاخد إيه؟ Inputs:** items,loading,onAddToCart.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX.

### CartToast

يعرض رسالة نجاح الإضافة حسب show مع AnimatePresence.

- **بتاخد إيه؟ Inputs:** show Boolean.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX.

### Home

يشتق أول 4 pizzas المتاحة للفرع ويجمع Hero/Awards/HeatVault/About/Contact/Toast.

- **بتاخد إيه؟ Inputs:** heroReady,onHeroReady,reduceMotion من AppShell.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX.

### addToCart

يتعامل مع اختلاف الفرع ثم يزيد المنتج الموجود أو يضيف واحدًا بكمية 1، يحفظ ويظهر Toast 2200ms.

- **بتاخد إيه؟ Inputs:** item مهيأ بسعر وخيارات الفرع.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### JSON.parse

- **جاية منين؟** JavaScript

- **وظيفتها:** يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل.

- **المدخلات — Arguments:** JSON string

- **الناتج/الأثر — Return / effect:** JS value

- **أول موضع هنا:** السطر 90، والمدخلات المكتوبة: `localStorage.getItem(CART_STORAGE_KEY) || '[]'`.

- **مثال:** const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

### localStorage.getItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تقرأ النص المحفوظ تحت مفتاح.

- **المدخلات — Arguments:** اسم المفتاح.

- **الناتج/الأثر — Return / effect:** string أو null؛ لا تعيد object تلقائيًا.

- **أول موضع هنا:** السطر 90، والمدخلات المكتوبة: `CART_STORAGE_KEY`.

### localStorage.setItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة.

- **المدخلات — Arguments:** key وvalue.

- **الناتج/الأثر — Return / effect:** undefined؛ قد تفشل لو التخزين غير متاح.

- **أول موضع هنا:** السطر 97، والمدخلات المكتوبة: `CART_STORAGE_KEY`، `JSON.stringify(cart)`.

### JSON.stringify

- **جاية منين؟** JavaScript

- **وظيفتها:** يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** string أو undefined لبعض القيم

- **أول موضع هنا:** السطر 97، والمدخلات المكتوبة: `cart`.

- **مثال:** localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

### window.dispatchEvent

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** ترسل Event للمستمعين على هذا الهدف بشكل متزامن.

- **المدخلات — Arguments:** Event object.

- **الناتج/الأثر — Return / effect:** Boolean مرتبطة بعدم إلغاء default؛ مش HTTP response.

- **أول موضع هنا:** السطر 98، والمدخلات المكتوبة: `new Event(CART_EVENT_NAME)`.

### Event

- **جاية منين؟** Browser

- **وظيفتها:** تنشئ Event تحمل نوع الحدث.

- **المدخلات — Arguments:** event type وoptions.

- **الناتج/الأثر — Return / effect:** Event object؛ الإرسال يحتاج dispatchEvent.

- **أول موضع هنا:** السطر 98، والمدخلات المكتوبة: `CART_EVENT_NAME`.

### React.useRef

- **جاية منين؟** React

- **وظيفتها:** تحتفظ بقيمة مستمرة بين renders بدون render عند تغيير current.

- **المدخلات — Arguments:** قيمة البداية.

- **الناتج/الأثر — Return / effect:** object ثابت فيه current.

- **أول موضع هنا:** السطر 119، والمدخلات المكتوبة: `false`.

### React.useCallback

- **جاية منين؟** React

- **وظيفتها:** تحافظ على مرجع function حسب الاعتمادات.

- **المدخلات — Arguments:** function وdependencies.

- **الناتج/الأثر — Return / effect:** مرجع function؛ لا تنفّذها ولا تخزّن نتيجة طلبها.

- **أول موضع هنا:** السطر 121، والمدخلات المكتوبة: `() => {         if (hasRevealedRef.current) return;          hasRevealedRef.current = true;         onReady();     }`، `[onReady]`.

### onReady

- **جاية منين؟** Callback/دالة مأخوذة من props أو Context حسب تعريف المكوّن

- **وظيفتها:** تنادي العملية اللي الأب أو الـContext مرّرها باسم onReady؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي.

- **المدخلات — Arguments:** بدون arguments مباشرة هنا.

- **الناتج/الأثر — Return / effect:** العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.

- **أول موضع هنا:** السطر 125.

### useEffect

- **جاية منين؟** React

- **وظيفتها:** يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies.

- **المدخلات — Arguments:** setup callback, dependencies

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 421، والمدخلات المكتوبة: `() => {         if (!showToast) {             return undefined;         }          const timeoutId = window.setTimeout(() => {             setShowToast(false);         }, 2200);   …`، `[showToast]`.

- **مثال:** useEffect(() => { window.addEventListener('resize', updateRunway); return () => window.removeEventListener('resize', updateRunway); }, []);

### revealContent

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يمنع تكرار reveal باستخدام ref ثم ينادي onReady من الأب؛ يُستخدم من animation loop وonEnded وonError وplay.catch.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 175.

### video.pause

- **جاية منين؟** HTMLMediaElement

- **وظيفتها:** توقف التشغيل مؤقتًا.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تمسح الملف.

- **أول موضع هنا:** السطر 138.

### video.load

- **جاية منين؟** Browser HTMLMediaElement

- **وظيفتها:** يطلب إعادة اختيار وتحميل مصدر الفيديو؛ مختلف عن load handlers المخصصة لجلب بيانات الأدمن.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 141.

- **مثال:** video.load();

### Number.isFinite

- **جاية منين؟** Number static

- **وظيفتها:** تفحص رقمًا محدودًا بدون تحويل النصوص.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 150، والمدخلات المكتوبة: `video.duration`.

### Math.min

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** ترجع أصغر المدخلات.

- **المدخلات — Arguments:** أعداد.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 154، والمدخلات المكتوبة: `1`، `(video.currentTime - HERO_SLOWDOWN_START) / (slowdownEnd - HERO_SLOWDOWN_START)`.

### window.requestAnimationFrame

- **جاية منين؟** Browser

- **وظيفتها:** تطلب callback قبل فرصة رسم إطار قادم؛ ليست loop تلقائية.

- **المدخلات — Arguments:** callback تستقبل timestamp.

- **الناتج/الأثر — Return / effect:** request ID؛ لو محتاج تكرار تعيد التسجيل.

- **أول موضع هنا:** السطر 170، والمدخلات المكتوبة: `updatePlayback`.

### video.play

- **جاية منين؟** HTMLMediaElement

- **وظيفتها:** تحاول بدء تشغيل فيديو/صوت.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** Promise قد ترفض بسبب autoplay أو خطأ؛ عالجها.

- **أول موضع هنا:** السطر 172.

### playPromise?.catch

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة فشل الـPromise.

- **المدخلات — Arguments:** callback تستقبل سبب الفشل.

- **الناتج/الأثر — Return / effect:** Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.

- **أول موضع هنا:** السطر 173، والمدخلات المكتوبة: `() => {             if (isCurrentPlayback) {                 revealContent();                 window.cancelAnimationFrame(animationFrameId);             }         }`.

### window.cancelAnimationFrame

- **جاية منين؟** Browser

- **وظيفتها:** تلغي طلب إطار معلّق.

- **المدخلات — Arguments:** ID الراجع من requestAnimationFrame.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 182، والمدخلات المكتوبة: `animationFrameId`.

### awards.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 288، والمدخلات المكتوبة: `(award, index) => (                         <motion.article                             className="wtc-award-card"                             key={'${award.title}-${award.detail}'…`.

### items.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 341، والمدخلات المكتوبة: `(item, index) => (                         <div className="col-12 col-md-6 col-xl-3" key={item.id}>                             <motion.article                                 clas…`.

### onAddToCart

- **جاية منين؟** Callback/دالة مأخوذة من props أو Context حسب تعريف المكوّن

- **وظيفتها:** تنادي العملية اللي الأب أو الـContext مرّرها باسم onAddToCart؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي.

- **المدخلات — Arguments:** item

- **الناتج/الأثر — Return / effect:** العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.

- **أول موضع هنا:** السطر 365، والمدخلات المكتوبة: `item`.

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 401، والمدخلات المكتوبة: `false`.

- **مثال:** const [failed, setFailed] = useState(false);

### useCatalog

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يوصل المكوّن إلى الكتالوج المشترك؛ يفشل بوضوح لو Provider غير موجود.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** branches/categories/items/loading/error/reload.

- **أول موضع هنا:** السطر 402.

- **تكملة التعريف:** [resources/js/context/CatalogContext.jsx](../context/CatalogContext.jsx.md)، عند السطر 37.

### useOrder

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** Custom hook يقرأ اختيار الفرع وطريقة الاستلام والعنوان ودوال تغييرها.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** value الخاص بـ OrderContext أو يرمي خطأ لو خارج Provider.

- **أول موضع هنا:** السطر 403.

- **تكملة التعريف:** [resources/js/context/OrderContext.jsx](../context/OrderContext.jsx.md)، عند السطر 127.

### useMemo

- **جاية منين؟** React hook

- **وظيفتها:** يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects.

- **المدخلات — Arguments:** calculate function,dependencies.

- **الناتج/الأثر — Return / effect:** القيمة المحسوبة.

- **أول موضع هنا:** السطر 405، والمدخلات المكتوبة: `() => {         const activeBranchId = branchId || branches[0]?.id;         const branch = selectedBranch || branches.find((entry) => entry.id === activeBranchId);          return …`، `[branches, items, branchId, selectedBranch]`.

- **مثال:** const completedOrders = useMemo(() => orders.filter((order) => order.status === 'completed'), [orders]);

### branches.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 407، والمدخلات المكتوبة: `(entry) => entry.id === activeBranchId`.

### items             .filter((item) => item.category_slug === 'pizzas' && branchOption(item, activeBranchId)?.is_available)             .slice(0, 4)             .map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 409، والمدخلات المكتوبة: `(item) => ({                 ...item,                 price: Number(branchOption(item, activeBranchId).price),                 image_src: item.image_path,                 branch_id…`.

### items             .filter((item) => item.category_slug === 'pizzas' && branchOption(item, activeBranchId)?.is_available)             .slice

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تأخذ جزءًا بدون تعديل الأصل.

- **المدخلات — Arguments:** start وend غير شامل النهاية.

- **الناتج/الأثر — Return / effect:** نسخة array جزئية أو نص جزئي حسب المستقبِل.

- **أول موضع هنا:** السطر 409، والمدخلات المكتوبة: `0`، `4`.

### items             .filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 409، والمدخلات المكتوبة: `(item) => item.category_slug === 'pizzas' && branchOption(item, activeBranchId)?.is_available`.

### branchOption

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يبحث عن سعر وتوفر منتج في فرع بعينه. السعر مش ثابت في item نفسه؛ مصدره branch_options.

- **المدخلات — Arguments:** item: المنتج وقد يكون undefined؛ branchId: رقم أو نص معرّف الفرع.

- **الناتج/الأثر — Return / effect:** object خيار الفرع أو null؛ Number يوحّد نوع المعرّفات قبل المقارنة.

- **أول موضع هنا:** السطر 414، والمدخلات المكتوبة: `item`، `activeBranchId`.

- **تكملة التعريف:** [resources/js/context/CatalogContext.jsx](../context/CatalogContext.jsx.md)، عند السطر 45.

### Number

- **جاية منين؟** JavaScript conversion function

- **وظيفتها:** يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** number أو NaN.

- **أول موضع هنا:** السطر 437، والمدخلات المكتوبة: `item.branch_id`.

- **مثال:** Number(option.price);

### window.setTimeout

- **جاية منين؟** Browser

- **وظيفتها:** ترتّب نداء callback مرة واحدة بعد التأخير.

- **المدخلات — Arguments:** callback وdelay بالمللي ثانية.

- **الناتج/الأثر — Return / effect:** timer ID في المتصفح.

- **أول موضع هنا:** السطر 426، والمدخلات المكتوبة: `() => {             setShowToast(false);         }`، `2200`.

### setShowToast

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setShowToast هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 464، والمدخلات المكتوبة: `true`.

### window.clearTimeout

- **جاية منين؟** Browser

- **وظيفتها:** تلغي نداء timeout لم يبدأ بعد.

- **المدخلات — Arguments:** timeout ID.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تمسح تعريف callback.

- **أول موضع هنا:** السطر 431، والمدخلات المكتوبة: `timeoutId`.

### readCart

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** قراءة السلة الحالية مع fallback عند JSON تالف.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** cart أو [].

- **أول موضع هنا:** السطر 439.

### currentCart.some

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 437، والمدخلات المكتوبة: `(line) => Number(line.branch_id) !== Number(item.branch_id)`.

### setBranch

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 438، والمدخلات المكتوبة: `item.branch_id`.

### currentCart.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 441، والمدخلات المكتوبة: `(cartItem) => cartItem.id === item.id`.

### currentCart.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 444، والمدخلات المكتوبة: `(cartItem) => (                 cartItem.id === item.id                     ? { ...cartItem, quantity: cartItem.quantity + 1 }                     : cartItem             )`.

### writeCart

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** حفظ السلة والإعلان عن تحديثها.

- **المدخلات — Arguments:** cart array.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 463، والمدخلات المكتوبة: `nextCart`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
// resources/js/Pages/Home.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { branchOption, useCatalog } from '../context/CatalogContext';
import { useOrder } from '../context/OrderContext';

```

**السطر 1:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 3:** Import / استيراد: الأسماء `React`، `useEffect`، `useMemo`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `motion`، `AnimatePresence` جاية من `framer-motion`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 5:** Import / استيراد: الأسماء `Link` جاية من `react-router-dom`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 6:** Import / استيراد: الأسماء `branchOption`، `useCatalog` جاية من `../context/CatalogContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 7:** Import / استيراد: الأسماء `useOrder` جاية من `../context/OrderContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

### السطور 9–16

```jsx
const CART_STORAGE_KEY = import.meta.env.VITE_DEMO_MODE === 'true' ? 'wtc_demo_cart' : 'wtc_cart';
const CART_EVENT_NAME = 'wtc-cart-updated';

const awards = [
    {
        title: '50 Top Pizza World',
        detail: '2023 - 84th Place',
        label: 'World Ranking',
```

**السطر 9:** Variable declaration / تعريف `CART_STORAGE_KEY` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 10:** Variable declaration / تعريف `CART_EVENT_NAME` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `"wtc-cart-updated"`، مش ناتج طلب شبكة.

**السطر 12:** Variable declaration / تعريف `awards` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 4 عنصرًا؛ العناصر نفسها في السطور التالية.

**السطر 13:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 14:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 15:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 16:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 17–24

```jsx
    },
    {
        title: 'Pioneer in Field Award',
        detail: '2022',
        label: 'Industry Honor',
    },
    {
        title: 'Top Africa',
```

**السطر 17:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 18:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 19:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 20:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 21:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 23:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 24:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 25–32

```jsx
        detail: '2021',
        label: 'Continental List',
    },
    {
        title: 'Top Ten Neapolitan Pizza Outside Italy',
        detail: '2021',
        label: 'International Top Ten',
    },
```

**السطر 25:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 26:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 27:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 28:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 29:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 30:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 31:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 32:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 33–40

```jsx
];

const textWrap = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
```

**السطر 33:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 35:** Variable declaration / تعريف `textWrap` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `hidden`، `visible`.

**السطر 36:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 37:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 38:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 39:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 40:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 41–48

```jsx
    },
};

const textItem = {
    hidden: {
        opacity: 0,
        y: 18,
    },
```

**السطر 41:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 42:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 44:** Variable declaration / تعريف `textItem` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `hidden`، `visible`.

**السطر 45:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 46:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 47:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 48:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 49–56

```jsx
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: 'easeOut',
        },
    },
```

**السطر 49:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 50:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 51:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 52:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 53:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 54:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 55:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 56:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 57–64

```jsx
};

const heroReveal = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
```

**السطر 57:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 59:** Variable declaration / تعريف `heroReveal` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `hidden`، `visible`.

**السطر 60:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 61:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 62:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 63:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 64:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 65–72

```jsx
    },
};

const heroRevealItem = {
    hidden: {
        opacity: 0,
        y: 25,
    },
```

**السطر 65:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 66:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 68:** Variable declaration / تعريف `heroRevealItem` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `hidden`، `visible`.

**السطر 69:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 70:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 71:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 72:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 73–80

```jsx
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
```

**السطر 73:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 74:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 75:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 76:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 77:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 78:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 79:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 80:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 81–88

```jsx
};

const HERO_REVEAL_TIME = 1.2;
const HERO_SLOWDOWN_START = 6;
const HERO_SLOWDOWN_END = 8;
const HERO_MIN_PLAYBACK_RATE = 0.35;

function readCart() {
```

**السطر 81:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 83:** Variable declaration / تعريف `HERO_REVEAL_TIME` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `1.2`، مش ناتج طلب شبكة.

**السطر 84:** Variable declaration / تعريف `HERO_SLOWDOWN_START` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `6`، مش ناتج طلب شبكة.

**السطر 85:** Variable declaration / تعريف `HERO_SLOWDOWN_END` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `8`، مش ناتج طلب شبكة.

**السطر 86:** Variable declaration / تعريف `HERO_MIN_PLAYBACK_RATE` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `0.35`، مش ناتج طلب شبكة.

**السطر 88:** Function / تعريف دالة `readCart`؛ تعريفها مش تشغيلها. قراءة السلة الحالية مع fallback عند JSON تالف. مدخلاتها: لا شيء. ناتجها: cart أو [].

### السطور 89–96

```jsx
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function writeCart(cart) {
```

**السطر 89:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 90:** Return / رجّع `JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `JSON.parse(...)`: يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل. القيم المكتوبة هنا: `localStorage.getItem(CART_STORAGE_KEY) || '[]'`. العائد/الأثر: JS value؛ `localStorage.getItem(...)`: تقرأ النص المحفوظ تحت مفتاح. القيم المكتوبة هنا: `CART_STORAGE_KEY`. العائد/الأثر: string أو null؛ لا تعيد object تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 91:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 92:** Return / رجّع `[]` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 93:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 94:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 96:** Function / تعريف دالة `writeCart`؛ تعريفها مش تشغيلها. حفظ السلة والإعلان عن تحديثها. مدخلاتها: cart array. ناتجها: undefined.

### السطور 97–104

```jsx
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_EVENT_NAME));
}

function LaurelIcon() {
    return (
        <svg width="42" height="42" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M24 50C13 44 8 34 11 20" stroke="#e32424" strokeWidth="3" strokeLinecap="round" />
```

**السطر 97:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `localStorage.setItem(...)`: تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة. القيم المكتوبة هنا: `CART_STORAGE_KEY`، `JSON.stringify(cart)`. العائد/الأثر: undefined؛ قد تفشل لو التخزين غير متاح.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `cart`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 98:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.dispatchEvent(...)`: ترسل Event للمستمعين على هذا الهدف بشكل متزامن. القيم المكتوبة هنا: `new Event(CART_EVENT_NAME)`. العائد/الأثر: Boolean مرتبطة بعدم إلغاء default؛ مش HTTP response.؛ `Event(...)`: تنشئ Event تحمل نوع الحدث. القيم المكتوبة هنا: `CART_EVENT_NAME`. العائد/الأثر: Event object؛ الإرسال يحتاج dispatchEvent.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 99:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 101:** Function / تعريف دالة `LaurelIcon`؛ تعريفها مش تشغيلها. يرسم أيقونة SVG زينة الجوائز. مدخلاتها: لا شيء. ناتجها: JSX.

**السطر 102:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 103:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 104:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 105–112

```jsx
            <path d="M40 50C51 44 56 34 53 20" stroke="#e32424" strokeWidth="3" strokeLinecap="round" />
            <path d="M16 23C21 23 23 20 24 16C19 15 16 18 16 23Z" fill="#F1A83A" />
            <path d="M14 32C19 31 21 28 21 24C16 24 13 27 14 32Z" fill="#F1A83A" />
            <path d="M18 41C23 39 24 36 23 32C18 33 16 36 18 41Z" fill="#F1A83A" />
            <path d="M48 23C43 23 41 20 40 16C45 15 48 18 48 23Z" fill="#F1A83A" />
            <path d="M50 32C45 31 43 28 43 24C48 24 51 27 50 32Z" fill="#F1A83A" />
            <path d="M46 41C41 39 40 36 41 32C46 33 48 36 46 41Z" fill="#F1A83A" />
            <path d="M24 50H40" stroke="#e32424" strokeWidth="3" strokeLinecap="round" />
```

**السطر 105:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 106:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 107:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 108:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 109:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 110:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 111:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 112:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 113–120

```jsx
        </svg>
    );
}

function HeroSection({ isReady, onReady, reduceMotion }) {
    const videoRef = React.useRef(null);
    const hasRevealedRef = React.useRef(false);

```

**السطر 113:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 114:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 115:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 117:** Function / تعريف دالة `HeroSection`؛ تعريفها مش تشغيلها. يدير عنصر video بالـ ref ويعرض النص عندما الأب يمرر isReady=true. يبطئ playback تدريجيًا قرب نهاية المقدمة. مدخلاتها: isReady,onReady,reduceMotion. ناتجها: JSX video وoverlay.

**السطر 118:** Variable declaration / تعريف `videoRef` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `React.useRef(...)`: تحتفظ بقيمة مستمرة بين renders بدون render عند تغيير current. القيم المكتوبة هنا: `null`. العائد/الأثر: object ثابت فيه current.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 119:** Variable declaration / تعريف `hasRevealedRef` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `React.useRef(...)`: تحتفظ بقيمة مستمرة بين renders بدون render عند تغيير current. القيم المكتوبة هنا: `false`. العائد/الأثر: object ثابت فيه current.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 121–128

```jsx
    const revealContent = React.useCallback(() => {
        if (hasRevealedRef.current) return;

        hasRevealedRef.current = true;
        onReady();
    }, [onReady]);

    useEffect(() => {
```

**السطر 121:** Variable declaration / تعريف `revealContent` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `revealContent` هنا: يمنع تكرار reveal باستخدام ref ثم ينادي onReady من الأب؛ يُستخدم من animation loop وonEnded وonError وplay.catch. المدخلات: لا شيء.. الناتج/الأثر: undefined.. الدوال الموجودة في السطر: `React.useCallback(...)`: تحافظ على مرجع function حسب الاعتمادات. القيم المكتوبة هنا: `() => {         if (hasRevealedRef.current) return;          hasRevealedRef.current = true;         onReady();…`، `[onReady]`. العائد/الأثر: مرجع function؛ لا تنفّذها ولا تخزّن نتيجة طلبها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 122:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 124:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 125:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `onReady(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onReady؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. مدخلاتها: بدون arguments مباشرة هنا. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 126:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 128:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         let isCurrentPlayback = true;         let animationFrameId = 0;         const video = videoRef…`، `[revealContent]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 129–136

```jsx
        let isCurrentPlayback = true;
        let animationFrameId = 0;
        const video = videoRef.current;
        if (!video) {
            revealContent();
            return undefined;
        }

```

**السطر 129:** Variable declaration / تعريف `isCurrentPlayback` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `true`، مش ناتج طلب شبكة.

**السطر 130:** Variable declaration / تعريف `animationFrameId` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `0`، مش ناتج طلب شبكة.

**السطر 131:** Variable declaration / تعريف `video` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 132:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 133:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `revealContent(...)`: يمنع تكرار reveal باستخدام ref ثم ينادي onReady من الأب؛ يُستخدم من animation loop وonEnded وonError وplay.catch. مدخلاتها: لا شيء. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 134:** Return / رجّع `undefined` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 135:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 137–144

```jsx
        hasRevealedRef.current = false;
        video.pause();
        video.playbackRate = 1;
        video.currentTime = 0;
        video.load();

        const updatePlayback = () => {
            if (!isCurrentPlayback || video.error) return;
```

**السطر 137:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 138:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `video.pause(...)`: توقف التشغيل مؤقتًا. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined؛ لا تمسح الملف.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 139:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 140:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 141:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `video.load(...)`: يطلب إعادة اختيار وتحميل مصدر الفيديو؛ مختلف عن load handlers المخصصة لجلب بيانات الأدمن. مدخلاتها: لا شيء. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 143:** Variable declaration / تعريف `updatePlayback` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `updatePlayback` هنا: Callback لكل animation frame: يراقب currentTime لإظهار النص ويحسب playbackRate بعد الثانية 6 ثم يجدول نفسه ما دام الفيديو لم ينته. المدخلات: لا parameters مستخدمة.. الناتج/الأثر: undefined؛ requestAnimationFrame خارجي يعيد رقمًا للتنظيف..

**السطر 144:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 145–152

```jsx

            if (video.currentTime >= HERO_REVEAL_TIME) {
                revealContent();
            }

            if (Number.isFinite(video.duration) && video.duration > 0) {
                const slowdownEnd = Math.min(HERO_SLOWDOWN_END, video.duration);

```

**السطر 146:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 147:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `revealContent(...)`: يمنع تكرار reveal باستخدام ref ثم ينادي onReady من الأب؛ يُستخدم من animation loop وonEnded وonError وplay.catch. مدخلاتها: لا شيء. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 148:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 150:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `Number.isFinite(...)`: تفحص رقمًا محدودًا بدون تحويل النصوص. القيم المكتوبة هنا: `video.duration`. العائد/الأثر: Boolean.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 151:** Variable declaration / تعريف `slowdownEnd` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.min(...)`: ترجع أصغر المدخلات. القيم المكتوبة هنا: `HERO_SLOWDOWN_END`، `video.duration`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 153–160

```jsx
                if (video.currentTime >= HERO_SLOWDOWN_START && slowdownEnd > HERO_SLOWDOWN_START) {
                    const progress = Math.min(
                        1,
                        (video.currentTime - HERO_SLOWDOWN_START) / (slowdownEnd - HERO_SLOWDOWN_START),
                    );
                    const easedProgress = progress * progress * (3 - (2 * progress));
                    video.playbackRate = 1 - ((1 - HERO_MIN_PLAYBACK_RATE) * easedProgress);
                } else {
```

**السطر 153:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 154:** Variable declaration / تعريف `progress` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.min(...)`: ترجع أصغر المدخلات. القيم المكتوبة هنا: `1`، `(video.currentTime - HERO_SLOWDOWN_START) / (slowdownEnd - HERO_SLOWDOWN_START)`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 155:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 156:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 157:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 158:** Variable declaration / تعريف `easedProgress` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 159:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 160:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 161–168

```jsx
                    video.playbackRate = 1;
                }
            }

            if (!video.ended) {
                animationFrameId = window.requestAnimationFrame(updatePlayback);
            }
        };
```

**السطر 161:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 162:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 163:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 165:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 166:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `window.requestAnimationFrame(...)`: تطلب callback قبل فرصة رسم إطار قادم؛ ليست loop تلقائية. القيم المكتوبة هنا: `updatePlayback`. العائد/الأثر: request ID؛ لو محتاج تكرار تعيد التسجيل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 167:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 168:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 169–176

```jsx

        animationFrameId = window.requestAnimationFrame(updatePlayback);

        const playPromise = video.play();
        playPromise?.catch(() => {
            if (isCurrentPlayback) {
                revealContent();
                window.cancelAnimationFrame(animationFrameId);
```

**السطر 170:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `window.requestAnimationFrame(...)`: تطلب callback قبل فرصة رسم إطار قادم؛ ليست loop تلقائية. القيم المكتوبة هنا: `updatePlayback`. العائد/الأثر: request ID؛ لو محتاج تكرار تعيد التسجيل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 172:** Variable declaration / تعريف `playPromise` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `video.play(...)`: تحاول بدء تشغيل فيديو/صوت. مدخلاتها: بدون مدخلات. العائد/الأثر: Promise قد ترفض بسبب autoplay أو خطأ؛ عالجها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 173:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي. الدوال الموجودة في السطر: `playPromise?.catch(...)`: تسجّل معالجة فشل الـPromise. القيم المكتوبة هنا: `() => {             if (isCurrentPlayback) {                 revealContent();                 window.cancelAni…`. العائد/الأثر: Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 174:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 175:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `revealContent(...)`: يمنع تكرار reveal باستخدام ref ثم ينادي onReady من الأب؛ يُستخدم من animation loop وonEnded وonError وplay.catch. مدخلاتها: لا شيء. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 176:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.cancelAnimationFrame(...)`: تلغي طلب إطار معلّق. القيم المكتوبة هنا: `animationFrameId`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 177–184

```jsx
            }
        });

        return () => {
            isCurrentPlayback = false;
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [revealContent]);
```

**السطر 177:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 178:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 180:** Return / رجّع `() => {` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 181:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 182:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.cancelAnimationFrame(...)`: تلغي طلب إطار معلّق. القيم المكتوبة هنا: `animationFrameId`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 183:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 184:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 185–192

```jsx

    return (
        <section id="home" className="wtc-hero-section">
            <video
                key="hero-intro-video-v2"
                ref={videoRef}
                className="wtc-hero-video object-cover w-100 h-100 position-absolute top-0 start-0"
                src="/videos/hero-pizza-motion.mp4?v=20260930-2"
```

**السطر 186:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 187:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 188:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 189:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 190:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 191:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 192:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 193–200

```jsx
                muted
                playsInline
                preload="auto"
                onEnded={revealContent}
                onError={revealContent}
                aria-hidden="true"
            />
            <div className="wtc-hero-shade" aria-hidden="true" />
```

**السطر 193:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 194:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 195:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 196:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 197:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 198:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 199:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 200:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 201–208

```jsx

            <AnimatePresence>
                {isReady && (
                    <motion.div
                        className="wtc-hero-overlay"
                        variants={heroReveal}
                        initial={reduceMotion ? false : 'hidden'}
                        animate="visible"
```

**السطر 202:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 203:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 204:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 205:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 206:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 207:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 208:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 209–216

```jsx
                    >
                        <div className="wtc-hero-main container-fluid">
                            <div className="wtc-hero-copy-stack">
                                <motion.p className="eyebrow" variants={heroRevealItem}>
                                    Authentic. Flame-Baked. Irresistible.
                                </motion.p>

                                <motion.h1 className="wtc-hero-title" variants={heroRevealItem}>
```

**السطر 209:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 210:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 211:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 212:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 213:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 214:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 216:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 217–224

```jsx
                                    Hot Stone Pizza
                                    <span>Made Fresh Daily</span>
                                </motion.h1>

                                <motion.p className="wtc-hero-description" variants={heroRevealItem}>
                                    Handcrafted pizzas made with premium ingredients, baked to perfection
                                    at intense heat for a blistered crust, rich sauce, and molten cheese.
                                </motion.p>
```

**السطر 217:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 218:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 219:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 221:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 222:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 223:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 224:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 225–232

```jsx

                                <motion.div
                                    className="wtc-hero-actions d-flex flex-wrap gap-3"
                                    variants={heroRevealItem}
                                >
                                    <Link to="/menu" className="btn btn-red btn-lg">
                                        Order Now
                                    </Link>
```

**السطر 226:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 227:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 228:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 229:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 230:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 231:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 232:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 233–240

```jsx

                                    <Link to="/menu" className="btn btn-outline-glow btn-lg">
                                        View Menu
                                    </Link>
                                </motion.div>
                            </div>
                        </div>

```

**السطر 234:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 235:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 236:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 237:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 238:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 239:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 241–248

```jsx
                        <motion.div className="wtc-hero-stats" variants={heroRevealItem}>
                            <div className="wtc-hero-stats-inner container-fluid row row-cols-1 row-cols-md-3 g-0">
                                <div className="wtc-hero-stat wtc-hero-stat-flame col">
                                    <span aria-hidden="true">&#x1F525;</span>
                                    <strong>Flame-Baked</strong>
                                    <small>Intense heat, bold crust</small>
                                </div>

```

**السطر 241:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 242:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 243:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 244:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 245:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 246:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 247:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 249–256

```jsx
                                <div className="wtc-hero-stat wtc-hero-stat-fresh col">
                                    <span aria-hidden="true">&#x1F33F;</span>
                                    <strong>Fresh Ingredients</strong>
                                    <small>Sourced daily, always bright</small>
                                </div>

                                <div className="wtc-hero-stat wtc-hero-stat-delivery col">
                                    <span aria-hidden="true">&#x1F6F5;</span>
```

**السطر 249:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 250:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 251:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 252:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 253:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 255:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 256:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 257–264

```jsx
                                    <strong>Fast Delivery</strong>
                                    <small>Hot, fresh, and on time</small>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
```

**السطر 257:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 258:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 259:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 260:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 261:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 262:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 263:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 264:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 265–272

```jsx
        </section>
    );
}

function AwardsSection() {
    return (
        <section className="wtc-awards-section">
            <div className="container">
```

**السطر 265:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 266:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 267:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 269:** Function / تعريف دالة `AwardsSection`؛ تعريفها مش تشغيلها. يرسم awards الثابتة مع motion أثناء دخولها الشاشة؛ المحتوى ده claims داخل التصميم وليس تحققًا خارجيًا من جوائز. مدخلاتها: لا شيء. ناتجها: JSX.

**السطر 270:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 271:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 272:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 273–280

```jsx
                <div className="row align-items-end g-4 mb-5 wtc-awards-intro">
                    <div className="col-12 col-lg-7">
                        <p className="eyebrow">Awards & Recognition</p>
                        <h2 className="wtc-section-title">A trophy shelf for the crust.</h2>
                    </div>

                    <div className="col-12 col-lg-5">
                        <p className="wtc-section-copy">
```

**السطر 273:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 274:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 275:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 276:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 277:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 279:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 280:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 281–288

```jsx
                            A premium crust deserves a proper showcase. These honors bring the
                            brand an authoritative, international glow.
                        </p>
                    </div>
                </div>

                <div className="wtc-awards-showcase">
                    {awards.map((award, index) => (
```

**السطر 281:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 282:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 283:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 284:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 285:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 287:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 288:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `awards.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(award, index) => (                         <motion.article                             className="wtc-award-c…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 289–296

```jsx
                        <motion.article
                            className="wtc-award-card"
                            key={`${award.title}-${award.detail}`}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.45, delay: index * 0.08 }}
                        >
```

**السطر 289:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 290:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 291:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 292:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 293:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 294:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 295:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 296:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 297–304

```jsx
                            <div className="wtc-award-glow" aria-hidden="true" />

                            <div className="wtc-award-topline">
                                <span className="wtc-award-rank">0{index + 1}</span>
                                <span className="wtc-award-label">{award.label}</span>
                            </div>

                            <div className="wtc-award-medal">
```

**السطر 297:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 299:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 300:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 301:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 302:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 304:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 305–312

```jsx
                                <LaurelIcon />
                            </div>

                            <div>
                                <h3>{award.title}</h3>
                                <p>{award.detail}</p>
                            </div>
                        </motion.article>
```

**السطر 305:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 306:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 308:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 309:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 310:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 311:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 312:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 313–320

```jsx
                    ))}
                </div>
            </div>
        </section>
    );
}

function HeatVaultSection({ items, loading, onAddToCart }) {
```

**السطر 313:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 314:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 315:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 316:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 317:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 318:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 320:** Function / تعريف دالة `HeatVaultSection`؛ تعريفها مش تشغيلها. يرسم featured cards؛ الزر ينادي onAddToCart(item) اللي وصل من Home، فلا يكتب storage بنفسه. مدخلاتها: items,loading,onAddToCart. ناتجها: JSX.

### السطور 321–328

```jsx
    return (
        <section className="wtc-heat-vault-section">
            <div className="container">
                <div className="text-center mx-auto mb-5" style={{ maxWidth: '760px' }}>
                    <p className="eyebrow">Fresh From The Heat Vault</p>
                    <h2 className="wtc-section-title">Signature slices with serious swagger.</h2>
                    <p className="wtc-section-copy mx-auto">
                        Image-first cards, chef-style details, red prices, and one-tap cart magic.
```

**السطر 321:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 322:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 323:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 324:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 325:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 326:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 327:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 328:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 329–336

```jsx
                    </p>

                    <div className="mt-4">
                        <Link to="/menu" className="btn btn-red btn-lg">
                            View Full Menu
                        </Link>
                    </div>
                </div>
```

**السطر 329:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 331:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 332:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 333:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 334:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 335:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 336:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 337–344

```jsx

                {loading && <p className="text-center text-secondary" role="status">Loading featured pizzas...</p>}
                {!loading && !items.length && <p className="text-center text-secondary">Featured pizzas are not available right now.</p>}
                <div className="row g-4">
                    {items.map((item, index) => (
                        <div className="col-12 col-md-6 col-xl-3" key={item.id}>
                            <motion.article
                                className="wtc-menu-card"
```

**السطر 338:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 339:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 340:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 341:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `items.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item, index) => (                         <div className="col-12 col-md-6 col-xl-3" key={item.id}>           …`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 342:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 343:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 344:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 345–352

```jsx
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.25 }}
                                transition={{ duration: 0.45, delay: index * 0.08 }}
                            >
                                <div className="wtc-menu-card-image">
                                    {item.image_src ? <img src={item.image_src} alt={item.name} loading="lazy" decoding="async" /> : <div className="menu-image-placeholder" role="img" aria-label={`${item.name} photo coming soon`}>WTC</div>}
                                    <span>{item.tag || 'Featured'}</span>
```

**السطر 345:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 346:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 347:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 348:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 349:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 350:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 351:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 352:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 353–360

```jsx
                                </div>

                                <div className="wtc-menu-card-body">
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>

                                    <div className="wtc-menu-card-footer">
                                        <strong>EGP {item.price}</strong>
```

**السطر 353:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 355:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 356:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 357:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 359:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 360:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 361–368

```jsx

                                        <button
                                            type="button"
                                            aria-label={`Add ${item.name} to cart`}
                                            onClick={() => onAddToCart(item)}
                                        >
                                            +
                                        </button>
```

**السطر 362:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 363:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 364:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 365:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `onAddToCart(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onAddToCart؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. القيم المكتوبة هنا: `item`. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 366:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 367:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 368:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 369–376

```jsx
                                    </div>
                                </div>
                            </motion.article>
                        </div>
                    ))}
                </div>
            </div>
        </section>
```

**السطر 369:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 370:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 371:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 372:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 373:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 374:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 375:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 376:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 377–384

```jsx
    );
}

function CartToast({ show }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
```

**السطر 377:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 378:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 380:** Function / تعريف دالة `CartToast`؛ تعريفها مش تشغيلها. يعرض رسالة نجاح الإضافة حسب show مع AnimatePresence. مدخلاتها: show Boolean. ناتجها: JSX.

**السطر 381:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 382:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 383:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 384:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 385–392

```jsx
                    className="wtc-cart-toast"
                    initial={{ opacity: 0, y: 22, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 18, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    role="status"
                >
                    <span>✓</span>
```

**السطر 385:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 386:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 387:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 388:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 389:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 390:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 391:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 392:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 393–400

```jsx
                    Added to Cart Successfully!
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function Home({ heroReady, onHeroReady, reduceMotion }) {
```

**السطر 393:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 394:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 395:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 396:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 397:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 398:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 400:** Function / تعريف دالة `Home`؛ تعريفها مش تشغيلها. يشتق أول 4 pizzas المتاحة للفرع ويجمع Hero/Awards/HeatVault/About/Contact/Toast. مدخلاتها: heroReady,onHeroReady,reduceMotion من AppShell. ناتجها: JSX.

### السطور 401–408

```jsx
    const [showToast, setShowToast] = useState(false);
    const { branches, items, loading } = useCatalog();
    const { branchId, selectedBranch, setBranch } = useOrder();

    const heatVaultItems = useMemo(() => {
        const activeBranchId = branchId || branches[0]?.id;
        const branch = selectedBranch || branches.find((entry) => entry.id === activeBranchId);

```

**السطر 401:** Variable declaration / تعريف `showToast + setShowToast` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `false`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 402:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useCatalog(...)`: يوصل المكوّن إلى الكتالوج المشترك؛ يفشل بوضوح لو Provider غير موجود. مدخلاتها: لا شيء. العائد/الأثر: branches/categories/items/loading/error/reload.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 403:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useOrder(...)`: Custom hook يقرأ اختيار الفرع وطريقة الاستلام والعنوان ودوال تغييرها. مدخلاتها: لا شيء. العائد/الأثر: value الخاص بـ OrderContext أو يرمي خطأ لو خارج Provider.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 405:** Variable declaration / تعريف `heatVaultItems` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useMemo(...)`: يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects. القيم المكتوبة هنا: `() => {         const activeBranchId = branchId || branches[0]?.id;         const branch = selectedBranch || b…`، `[branches, items, branchId, selectedBranch]`. العائد/الأثر: القيمة المحسوبة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 406:** Variable declaration / تعريف `activeBranchId` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 407:** Variable declaration / تعريف `branch` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `branches.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(entry) => entry.id === activeBranchId`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 409–416

```jsx
        return items
            .filter((item) => item.category_slug === 'pizzas' && branchOption(item, activeBranchId)?.is_available)
            .slice(0, 4)
            .map((item) => ({
                ...item,
                price: Number(branchOption(item, activeBranchId).price),
                image_src: item.image_path,
                branch_id: activeBranchId,
```

**السطر 409:** Return / رجّع `items` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `items             .filter((item) => item.category_slug === 'pizzas' && branchOption(item, activeBranchId)?.is_available)             .slice(0, 4)             .map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item) => ({                 ...item,                 price: Number(branchOption(item, activeBranchId).price),…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `items             .filter((item) => item.category_slug === 'pizzas' && branchOption(item, activeBranchId)?.is_available)             .slice(...)`: تأخذ جزءًا بدون تعديل الأصل. القيم المكتوبة هنا: `0`، `4`. العائد/الأثر: نسخة array جزئية أو نص جزئي حسب المستقبِل.؛ `items             .filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(item) => item.category_slug === 'pizzas' && branchOption(item, activeBranchId)?.is_available`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 410:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `branchOption(...)`: يبحث عن سعر وتوفر منتج في فرع بعينه. السعر مش ثابت في item نفسه؛ مصدره branch_options. القيم المكتوبة هنا: `item`، `activeBranchId`. العائد/الأثر: object خيار الفرع أو null؛ Number يوحّد نوع المعرّفات قبل المقارنة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 411:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 412:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 413:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 414:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `branchOption(item, activeBranchId).price`. العائد/الأثر: number أو NaN.؛ `branchOption(...)`: يبحث عن سعر وتوفر منتج في فرع بعينه. السعر مش ثابت في item نفسه؛ مصدره branch_options. القيم المكتوبة هنا: `item`، `activeBranchId`. العائد/الأثر: object خيار الفرع أو null؛ Number يوحّد نوع المعرّفات قبل المقارنة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 415:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 416:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 417–424

```jsx
                branch_name: branch?.name,
            }));
    }, [branches, items, branchId, selectedBranch]);

    useEffect(() => {
        if (!showToast) {
            return undefined;
        }
```

**السطر 417:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 418:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 419:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 421:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         if (!showToast) {             return undefined;         }          const timeoutId = window.se…`، `[showToast]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 422:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 423:** Return / رجّع `undefined` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 424:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 425–432

```jsx

        const timeoutId = window.setTimeout(() => {
            setShowToast(false);
        }, 2200);

        return () => {
            window.clearTimeout(timeoutId);
        };
```

**السطر 426:** Variable declaration / تعريف `timeoutId` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `window.setTimeout(...)`: ترتّب نداء callback مرة واحدة بعد التأخير. القيم المكتوبة هنا: `() => {             setShowToast(false);         }`، `2200`. العائد/الأثر: timer ID في المتصفح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 427:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setShowToast(...)`: لو setShowToast هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 428:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 430:** Return / رجّع `() => {` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 431:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.clearTimeout(...)`: تلغي نداء timeout لم يبدأ بعد. القيم المكتوبة هنا: `timeoutId`. العائد/الأثر: undefined؛ لا تمسح تعريف callback.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 432:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 433–440

```jsx
    }, [showToast]);

    const addToCart = (item) => {
        let currentCart = readCart();
        if (currentCart.some((line) => Number(line.branch_id) !== Number(item.branch_id))) {
            if (!setBranch(item.branch_id)) return;
            currentCart = readCart();
        }
```

**السطر 433:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 435:** Variable declaration / تعريف `addToCart` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `addToCart` هنا: يتعامل مع اختلاف الفرع ثم يزيد المنتج الموجود أو يضيف واحدًا بكمية 1، يحفظ ويظهر Toast 2200ms. المدخلات: item مهيأ بسعر وخيارات الفرع.. الناتج/الأثر: undefined..

**السطر 436:** Variable declaration / تعريف `currentCart` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `readCart(...)`: قراءة السلة الحالية مع fallback عند JSON تالف. مدخلاتها: لا شيء. العائد/الأثر: cart أو [].. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 437:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `currentCart.some(...)`: تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح. القيم المكتوبة هنا: `(line) => Number(line.branch_id) !== Number(item.branch_id)`. العائد/الأثر: Boolean.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `item.branch_id`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 438:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `setBranch(...)`: لو setBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `item.branch_id`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 439:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `readCart(...)`: قراءة السلة الحالية مع fallback عند JSON تالف. مدخلاتها: لا شيء. العائد/الأثر: cart أو [].. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 440:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 441–448

```jsx
        const existingItem = currentCart.find((cartItem) => cartItem.id === item.id);

        const nextCart = existingItem
            ? currentCart.map((cartItem) => (
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            ))
```

**السطر 441:** Variable declaration / تعريف `existingItem` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `currentCart.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(cartItem) => cartItem.id === item.id`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 443:** Variable declaration / تعريف `nextCart` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 444:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `currentCart.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(cartItem) => (                 cartItem.id === item.id                     ? { ...cartItem, quantity: cartIte…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 445:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 446:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 447:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 448:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 449–456

```jsx
            : [
                ...currentCart,
                {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image_src: item.image_src,
```

**السطر 449:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 450:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 451:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 452:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 453:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 454:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 455:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 456:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 457–464

```jsx
                    branch_id: item.branch_id,
                    branch_name: item.branch_name,
                    quantity: 1,
                },
            ];

        writeCart(nextCart);
        setShowToast(true);
```

**السطر 457:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 458:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 459:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 460:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 461:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 463:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `writeCart(...)`: حفظ السلة والإعلان عن تحديثها. القيم المكتوبة هنا: `nextCart`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 464:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setShowToast(...)`: لو setShowToast هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `true`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 465–472

```jsx
    };

    return (
        <>
            <style>
                {`
                    .wtc-hero-section {
                        position: relative;
```

**السطر 465:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 467:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 468:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 469:** بداية CSS / تنسيق؛ لو scoped فـVue تضيف عزلًا بالـattributes أثناء البناء.

**السطر 470:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 471:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 472:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 473–480

```jsx
                        min-height: 100svh;
                        overflow: hidden;
                        background: #080808;
                        isolation: isolate;
                    }

                    .wtc-hero-video {
                        position: absolute;
```

**السطر 473:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 474:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 475:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 476:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 477:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 479:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 480:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 481–488

```jsx
                        inset: 0;
                        z-index: 0;
                        display: block;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        object-position: center;
                        transform: scale(1.12);
```

**السطر 481:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 482:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 483:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 484:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 485:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 486:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 487:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 488:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 489–496

```jsx
                        filter: saturate(1.08) contrast(1.05);
                        pointer-events: none;
                    }

                    .wtc-hero-shade {
                        position: absolute;
                        inset: 0;
                        z-index: 1;
```

**السطر 489:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 490:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 491:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 493:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 494:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 495:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 496:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 497–504

```jsx
                        pointer-events: none;
                        background:
                            linear-gradient(90deg, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.64) 38%, rgba(5,5,5,0.12) 72%),
                             linear-gradient(180deg, rgba(5,5,5,0.38) 0%, rgba(5,5,5,0.04) 46%, rgba(5,5,5,0.88) 100%);
                    }

                    .wtc-hero-shade::before,
                    .wtc-hero-shade::after {
```

**السطر 497:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 498:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 499:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 500:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 501:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 503:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 504:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 505–512

```jsx
                        content: "";
                        position: absolute;
                        pointer-events: none;
                    }

                    .wtc-hero-shade::before {
                        top: 0;
                        left: 0;
```

**السطر 505:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 506:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 507:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 508:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 510:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 511:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 512:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 513–520

```jsx
                        width: clamp(110px, 14vw, 220px);
                        height: clamp(86px, 15vh, 150px);
                        background: radial-gradient(ellipse at top left, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.82) 42%, transparent 76%);
                    }

                    .wtc-hero-shade::after {
                        right: 0;
                        bottom: 0;
```

**السطر 513:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 514:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 515:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 516:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 518:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 519:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 520:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 521–528

```jsx
                        width: clamp(100px, 13vw, 210px);
                        height: clamp(90px, 16vh, 165px);
                        background: radial-gradient(ellipse at bottom right, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.78) 40%, transparent 76%);
                    }

                    .wtc-hero-overlay {
                        position: relative;
                        z-index: 2;
```

**السطر 521:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 522:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 523:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 524:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 526:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 527:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 528:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 529–536

```jsx
                        min-height: 100svh;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-end;
                        padding-top: 84px;
                    }

                    .wtc-hero-main {
```

**السطر 529:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 530:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 531:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 532:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 533:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 534:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 536:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 537–544

```jsx
                        display: flex;
                        flex: 1 1 auto;
                        align-items: center;
                        padding: clamp(2rem, 5vh, 4.5rem) clamp(1.25rem, 5vw, 5.5rem);
                    }

                    .wtc-hero-copy-stack {
                        width: min(680px, 58vw);
```

**السطر 537:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 538:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 539:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 540:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 541:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 543:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 544:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 545–552

```jsx
                    }

                    .wtc-hero-title {
                        margin: 0 0 1.35rem;
                        font-size: clamp(3rem, 6.2vw, 6.8rem);
                        line-height: 0.88;
                        font-weight: 1000;
                        letter-spacing: 0;
```

**السطر 545:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 547:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 548:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 549:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 550:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 551:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 552:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 553–560

```jsx
                        color: #F5F5F5;
                        text-shadow: 0 14px 34px rgba(0,0,0,0.54);
                    }

                    .wtc-hero-title span {
                        display: block;
                        color: #e32424;
                    }
```

**السطر 553:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 554:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 555:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 557:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 558:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 559:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 560:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 561–568

```jsx

                    .wtc-hero-description {
                        max-width: 560px;
                        color: rgba(245,245,245,0.9);
                        font-size: 1rem;
                        line-height: 1.8;
                        text-shadow: 0 8px 24px rgba(0,0,0,0.52);
                    }
```

**السطر 562:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 563:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 564:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 565:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 566:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 567:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 568:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 569–576

```jsx

                    .wtc-hero-actions {
                        margin: 2rem 0;
                    }

                    .wtc-hero-stats {
                        flex: 0 0 auto;
                        border-top: 1px solid rgba(255,255,255,0.13);
```

**السطر 570:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 571:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 572:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 574:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 575:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 576:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 577–584

```jsx
                        background: rgba(7,7,7,0.58);
                        backdrop-filter: blur(14px);
                        -webkit-backdrop-filter: blur(14px);
                    }

                    .wtc-hero-stats-inner {
                        max-width: none;
                        margin: 0;
```

**السطر 577:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 578:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 579:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 580:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 582:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 583:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 584:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 585–592

```jsx
                        padding: 1.25rem clamp(1.25rem, 5vw, 5.5rem) 1.45rem;
                    }

                    .wtc-hero-stat {
                        min-width: 0;
                        position: relative;
                        padding-right: clamp(1rem, 4vw, 4rem);
                        text-shadow: 0 8px 24px rgba(0,0,0,0.52);
```

**السطر 585:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 586:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 588:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 589:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 590:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 591:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 592:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 593–600

```jsx
                    }

                    .wtc-hero-stat + .wtc-hero-stat::before {
                        content: "";
                        position: absolute;
                        top: 0.15rem;
                        bottom: 0.15rem;
                        left: 0;
```

**السطر 593:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 595:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 596:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 597:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 598:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 599:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 600:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 601–608

```jsx
                        width: 1px;
                        background: rgba(255,255,255,0.13);
                    }

                    .wtc-hero-stat + .wtc-hero-stat {
                        padding-left: clamp(1rem, 4vw, 4rem);
                    }

```

**السطر 601:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 602:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 603:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 605:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 606:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 607:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 609–616

```jsx
                    .wtc-hero-stat span {
                        display: inline-block;
                        font-size: 1.18rem;
                        line-height: 1;
                    }

                    .wtc-hero-stat strong {
                        display: block;
```

**السطر 609:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 610:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 611:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 612:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 613:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 615:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 616:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 617–624

```jsx
                        margin-top: 0.25rem;
                        font-size: 0.95rem;
                        line-height: 1.25;
                    }

                    .wtc-hero-stat small {
                        display: block;
                        margin-top: 0.38rem;
```

**السطر 617:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 618:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 619:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 620:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 622:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 623:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 624:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 625–632

```jsx
                        color: rgba(245,245,245,0.72);
                        font-size: 0.86rem;
                        line-height: 1.55;
                    }

                    .wtc-awards-section,
                    .wtc-heat-vault-section {
                        padding: 6.5rem 0;
```

**السطر 625:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 626:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 627:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 628:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 630:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 631:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 632:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 633–640

```jsx
                        background:
                            radial-gradient(circle at 82% 4%, rgba(227,38,38,0.08), transparent 28rem),
                            linear-gradient(180deg, #111 0%, #101010 48%, #111 100%);
                    }

                    .wtc-awards-section {
                        position: relative;
                        overflow: hidden;
```

**السطر 633:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 634:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 635:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 636:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 638:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 639:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 640:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 641–648

```jsx
                    }

                    .wtc-awards-section::before {
                        content: "";
                        position: absolute;
                        inset: 0;
                        pointer-events: none;
                        background:
```

**السطر 641:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 643:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 644:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 645:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 646:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 647:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 648:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 649–656

```jsx
                            radial-gradient(circle at 50% 38%, rgba(241,168,58,0.14), transparent 18rem),
                            radial-gradient(circle at 90% 0%, rgba(227,38,38,0.14), transparent 28rem);
                        opacity: 0.72;
                    }

                    .wtc-awards-intro,
                    .wtc-awards-showcase {
                        position: relative;
```

**السطر 649:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 650:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 651:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 652:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 654:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 655:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 656:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 657–664

```jsx
                        z-index: 2;
                    }

                    .wtc-section-title {
                        margin: 0;
                        color: #F5F5F5;
                        font-size: clamp(2.4rem, 4.5vw, 4.8rem);
                        line-height: 0.95;
```

**السطر 657:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 658:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 660:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 661:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 662:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 663:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 664:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 665–672

```jsx
                        font-weight: 1000;
                        letter-spacing: 0;
                    }

                    .wtc-section-copy {
                        color: rgba(245,245,245,0.66);
                        line-height: 1.8;
                    }
```

**السطر 665:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 666:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 667:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 669:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 670:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 671:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 672:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 673–680

```jsx

                    .wtc-awards-showcase {
                        display: grid;
                        grid-template-columns: repeat(4, minmax(0, 1fr));
                        gap: 1.1rem;
                        padding-top: 1.2rem;
                    }

```

**السطر 674:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 675:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 676:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 677:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 678:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 679:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 681–688

```jsx
                    .wtc-awards-showcase::before {
                        content: "";
                        position: absolute;
                        left: 1.5rem;
                        right: 1.5rem;
                        bottom: -1.25rem;
                        height: 1px;
                        background: linear-gradient(90deg, transparent, rgba(241,168,58,0.5), transparent);
```

**السطر 681:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 682:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 683:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 684:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 685:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 686:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 687:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 688:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 689–696

```jsx
                        box-shadow: 0 22px 60px rgba(241,168,58,0.18);
                    }

                    .wtc-award-card {
                        position: relative;
                        min-height: 280px;
                        display: flex;
                        flex-direction: column;
```

**السطر 689:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 690:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 692:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 693:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 694:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 695:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 696:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 697–704

```jsx
                        justify-content: space-between;
                        overflow: hidden;
                        padding: 1.25rem;
                        border-radius: 8px;
                        border: 1px solid rgba(241,168,58,0.2);
                        background:
                            linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.018) 52%, rgba(241,168,58,0.06)),
                            #1A1A1A;
```

**السطر 697:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 698:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 699:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 700:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 701:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 702:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 703:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 704:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 705–712

```jsx
                        box-shadow: 0 28px 80px rgba(0,0,0,0.34);
                        transition: transform 0.24s ease, border-color 0.24s ease, box-shadow 0.24s ease;
                    }

                    .wtc-award-card:hover {
                        transform: translateY(-7px);
                        border-color: rgba(241,168,58,0.45);
                        box-shadow: 0 34px 92px rgba(0,0,0,0.44), 0 0 36px rgba(241,168,58,0.08);
```

**السطر 705:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 706:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 707:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 709:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 710:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 711:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 712:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 713–720

```jsx
                    }

                    .wtc-award-glow {
                        position: absolute;
                        inset: -38% -20% auto;
                        height: 62%;
                        background: radial-gradient(circle, rgba(241,168,58,0.18), transparent 62%);
                        opacity: 0.86;
```

**السطر 713:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 715:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 716:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 717:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 718:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 719:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 720:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 721–728

```jsx
                        pointer-events: none;
                    }

                    .wtc-award-topline {
                        position: relative;
                        z-index: 2;
                        display: flex;
                        align-items: center;
```

**السطر 721:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 722:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 724:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 725:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 726:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 727:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 728:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 729–736

```jsx
                        justify-content: space-between;
                        gap: 1rem;
                    }

                    .wtc-award-rank {
                        width: fit-content;
                        padding: 0.36rem 0.65rem;
                        border-radius: 999px;
```

**السطر 729:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 730:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 731:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 733:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 734:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 735:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 736:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 737–744

```jsx
                        background: rgba(227,38,38,0.12);
                        color: #e32424;
                        font-weight: 950;
                        font-size: 0.75rem;
                    }

                    .wtc-award-label {
                        color: rgba(245,245,245,0.54);
```

**السطر 737:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 738:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 739:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 740:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 741:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 743:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 744:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 745–752

```jsx
                        font-size: 0.68rem;
                        font-weight: 900;
                        letter-spacing: 0.08em;
                        text-transform: uppercase;
                        text-align: right;
                    }

                    .wtc-award-medal {
```

**السطر 745:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 746:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 747:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 748:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 749:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 750:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 752:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 753–760

```jsx
                        position: relative;
                        z-index: 2;
                        width: 78px;
                        height: 78px;
                        display: grid;
                        place-items: center;
                        margin: 1rem 0 1.6rem;
                        border-radius: 50%;
```

**السطر 753:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 754:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 755:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 756:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 757:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 758:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 759:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 760:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 761–768

```jsx
                        background:
                            radial-gradient(circle at 50% 42%, rgba(241,168,58,0.22), rgba(227,38,38,0.08) 62%, rgba(255,255,255,0.03));
                        box-shadow: inset 0 0 0 1px rgba(241,168,58,0.18), 0 18px 38px rgba(0,0,0,0.28);
                    }

                    .wtc-award-card h3 {
                        margin: 0;
                        color: #F5F5F5;
```

**السطر 761:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 762:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 763:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 764:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 766:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 767:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 768:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 769–776

```jsx
                        font-size: clamp(1.05rem, 1.3vw, 1.28rem);
                        line-height: 1.25;
                        font-weight: 950;
                        letter-spacing: 0;
                    }

                    .wtc-award-card p {
                        margin: 0.45rem 0 0;
```

**السطر 769:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 770:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 771:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 772:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 773:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 775:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 776:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 777–784

```jsx
                        color: #F1A83A;
                        font-weight: 900;
                    }

                    .wtc-menu-card {
                        height: 100%;
                        overflow: hidden;
                        border-radius: 8px;
```

**السطر 777:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 778:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 779:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 781:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 782:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 783:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 784:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 785–792

```jsx
                        border: 1px solid rgba(255,255,255,0.07);
                        background: rgba(26,26,26,0.9);
                        color: #F5F5F5;
                        box-shadow: 0 24px 70px rgba(0,0,0,0.28);
                        transition: transform 0.25s ease, border-color 0.25s ease;
                    }

                    .wtc-menu-card:hover {
```

**السطر 785:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 786:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 787:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 788:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 789:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 790:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 792:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 793–800

```jsx
                        transform: translateY(-7px);
                        border-color: rgba(227,38,38,0.4);
                    }

                    .wtc-menu-card-image {
                        position: relative;
                        height: 210px;
                        overflow: hidden;
```

**السطر 793:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 794:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 795:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 797:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 798:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 799:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 800:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 801–808

```jsx
                        background:
                            radial-gradient(circle at 50% 45%, rgba(241,168,58,0.18), transparent 8rem),
                            #101010;
                    }

                    .wtc-menu-card-image img {
                        width: 100%;
                        height: 100%;
```

**السطر 801:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 802:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 803:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 804:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 806:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 807:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 808:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 809–816

```jsx
                        display: block;
                        object-fit: cover;
                        object-position: center;
                    }

                    .wtc-menu-card-image span {
                        position: absolute;
                        top: 1rem;
```

**السطر 809:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 810:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 811:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 812:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 814:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 815:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 816:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 817–824

```jsx
                        left: 1rem;
                        z-index: 2;
                        padding: 0.36rem 0.6rem;
                        border-radius: 999px;
                        background: #e32424;
                        color: #ffffff;
                        font-size: 0.68rem;
                        font-weight: 950;
```

**السطر 817:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 818:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 819:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 820:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 821:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 822:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 823:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 824:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 825–832

```jsx
                        text-transform: uppercase;
                        letter-spacing: 0.06em;
                    }

                    .wtc-menu-card-body {
                        padding: 1.2rem;
                    }

```

**السطر 825:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 826:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 827:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 829:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 830:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 831:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 833–840

```jsx
                    .wtc-menu-card-body h3 {
                        margin: 0 0 0.7rem;
                        font-size: 1.28rem;
                        line-height: 1.2;
                        font-weight: 950;
                        letter-spacing: 0;
                    }

```

**السطر 833:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 834:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 835:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 836:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 837:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 838:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 839:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 841–848

```jsx
                    .wtc-menu-card-body p {
                        min-height: 82px;
                        margin: 0;
                        color: rgba(245,245,245,0.62);
                        line-height: 1.65;
                    }

                    .wtc-menu-card-footer {
```

**السطر 841:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 842:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 843:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 844:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 845:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 846:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 848:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 849–856

```jsx
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 1rem;
                        margin-top: 1.2rem;
                    }

                    .wtc-menu-card-footer strong {
```

**السطر 849:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 850:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 851:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 852:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 853:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 854:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 856:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 857–864

```jsx
                        color: #e32424;
                        font-size: 1.05rem;
                        font-weight: 950;
                    }

                    .wtc-menu-card-footer button {
                        width: 42px;
                        height: 42px;
```

**السطر 857:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 858:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 859:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 860:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 862:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 863:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 864:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 865–872

```jsx
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        border: 0;
                        border-radius: 999px;
                        background: #e32424;
                        color: #ffffff;
                        font-size: 1.45rem;
```

**السطر 865:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 866:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 867:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 868:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 869:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 870:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 871:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 872:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 873–880

```jsx
                        font-weight: 900;
                        box-shadow: 0 12px 28px rgba(227,38,38,0.28);
                        transition: 0.22s ease;
                    }

                    .wtc-menu-card-footer button:hover {
                        transform: translateY(-2px) rotate(8deg);
                        background: #ff3838;
```

**السطر 873:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 874:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 875:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 876:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 878:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 879:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 880:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 881–888

```jsx
                    }

                    .wtc-cart-toast {
                        position: fixed;
                        right: 1.4rem;
                        bottom: 1.4rem;
                        z-index: 3000;
                        display: inline-flex;
```

**السطر 881:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 883:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 884:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 885:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 886:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 887:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 888:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 889–896

```jsx
                        align-items: center;
                        gap: 0.7rem;
                        padding: 0.95rem 1.1rem;
                        border-radius: 1rem;
                        border: 1px solid rgba(255,255,255,0.1);
                        background: rgba(26,26,26,0.92);
                        color: #F5F5F5;
                        font-weight: 900;
```

**السطر 889:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 890:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 891:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 892:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 893:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 894:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 895:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 896:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 897–904

```jsx
                        box-shadow: 0 24px 70px rgba(0,0,0,0.35);
                        backdrop-filter: blur(14px);
                        -webkit-backdrop-filter: blur(14px);
                    }

                    .wtc-cart-toast span {
                        width: 26px;
                        height: 26px;
```

**السطر 897:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 898:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 899:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 900:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 902:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 903:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 904:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 905–912

```jsx
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 999px;
                        background: #e32424;
                        color: #ffffff;
                    }

```

**السطر 905:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 906:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 907:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 908:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 909:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 910:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 911:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 913–920

```jsx
                    @media (max-width: 1199px) {
                        .wtc-awards-showcase {
                            grid-template-columns: repeat(2, minmax(0, 1fr));
                        }
                    }

                    @media (max-width: 767px) {
                        .wtc-hero-section {
```

**السطر 913:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 914:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 915:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 916:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 917:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 919:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 920:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 921–928

```jsx
                            min-height: max(100svh, 760px);
                        }

                        .wtc-hero-shade {
                            background:
                                linear-gradient(
                                    180deg,
                                    rgba(5,5,5,0.42) 0%,
```

**السطر 921:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 922:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 924:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 925:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 926:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 927:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 928:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 929–936

```jsx
                                    rgba(5,5,5,0.12) 28%,
                                    rgba(5,5,5,0.58) 58%,
                                    rgba(5,5,5,0.94) 100%
                                );
                        }

                        .wtc-hero-video {
                            object-position: center;
```

**السطر 929:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 930:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 931:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 932:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 933:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 935:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 936:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 937–944

```jsx
                        }

                        .wtc-hero-overlay {
                            min-height: max(100svh, 760px);
                            padding-top: 72px;
                        }

                        .wtc-hero-main {
```

**السطر 937:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 939:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 940:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 941:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 942:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 944:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 945–952

```jsx
                            align-items: flex-end;
                            padding: 2.25rem 1.2rem 1.6rem;
                        }

                        .wtc-hero-copy-stack {
                            width: 100%;
                            max-width: 590px;
                        }
```

**السطر 945:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 946:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 947:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 949:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 950:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 951:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 952:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 953–960

```jsx

                        .wtc-hero-title {
                            font-size: clamp(2.8rem, 13.5vw, 4.9rem);
                        }

                        .wtc-hero-description {
                            max-width: 560px;
                        }
```

**السطر 954:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 955:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 956:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 958:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 959:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 960:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 961–968

```jsx

                        .wtc-hero-actions {
                            margin: 1.8rem 0;
                        }

                        .wtc-hero-stats {
                            background: rgba(7,7,7,0.72);
                        }
```

**السطر 962:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 963:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 964:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 966:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 967:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 968:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 969–976

```jsx

                        .wtc-hero-stats-inner {
                            padding: 0.35rem 1.2rem 1rem;
                        }

                        .wtc-hero-stat {
                            min-width: 0;
                            display: grid;
```

**السطر 970:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 971:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 972:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 974:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 975:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 976:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 977–984

```jsx
                            grid-template-columns: 1.75rem 1fr;
                            grid-template-rows: auto auto;
                            align-items: center;
                            padding: 0.7rem 0;
                        }

                        .wtc-hero-stat + .wtc-hero-stat {
                            padding-left: 0;
```

**السطر 977:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 978:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 979:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 980:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 981:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 983:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 984:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 985–992

```jsx
                            border-top: 1px solid rgba(255,255,255,0.1);
                        }

                        .wtc-hero-stat + .wtc-hero-stat::before {
                            display: none;
                        }

                        .wtc-hero-stat span {
```

**السطر 985:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 986:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 988:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 989:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 990:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 992:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 993–1000

```jsx
                            grid-row: 1 / 3;
                            font-size: 1.05rem;
                        }

                        .wtc-hero-stat strong {
                            margin-top: 0;
                            font-size: 0.84rem;
                            line-height: 1.25;
```

**السطر 993:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 994:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 995:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 997:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 998:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 999:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 1000:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 1001–1008

```jsx
                        }

                        .wtc-hero-stat small {
                            margin-top: 0.1rem;
                            font-size: 0.72rem;
                            line-height: 1.35;
                        }

```

**السطر 1001:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1003:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 1004:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 1005:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 1006:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 1007:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 1009–1016

```jsx
                        .wtc-awards-section,
                        .wtc-heat-vault-section {
                            padding: 4.8rem 0;
                        }
                    }

                    @media (max-width: 575px) {
                        .wtc-hero-title {
```

**السطر 1009:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 1010:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 1011:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 1012:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1013:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1015:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 1016:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 1017–1024

```jsx
                            font-size: clamp(2.65rem, 14vw, 4.2rem);
                        }

                        .wtc-hero-actions {
                            width: 100%;
                        }

                        .wtc-hero-actions .btn {
```

**السطر 1017:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 1018:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1020:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 1021:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 1022:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1024:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 1025–1032

```jsx
                            flex: 1 1 calc(50% - 0.75rem);
                        }

                        .wtc-awards-showcase {
                            grid-template-columns: 1fr;
                        }

                        .wtc-cart-toast {
```

**السطر 1025:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 1026:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1028:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 1029:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 1030:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1032:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 1033–1040

```jsx
                            left: 1rem;
                            right: 1rem;
                            bottom: 1rem;
                            justify-content: center;
                        }
                    }
                `}
            </style>
```

**السطر 1033:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 1034:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 1035:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 1036:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 1037:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1038:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1039:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 1040:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 1041–1048

```jsx

            <main>
            <HeroSection
                isReady={heroReady}
                onReady={onHeroReady}
                reduceMotion={reduceMotion}
            />
                <AwardsSection />
```

**السطر 1042:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1043:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1044:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 1045:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 1046:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 1047:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 1048:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 1049–1056

```jsx
                <HeatVaultSection items={heatVaultItems} loading={loading} onAddToCart={addToCart} />

                <section id="about" className="section-padding about-section">
                    <div className="container">
                        <div className="row g-5 align-items-center">
                            <div className="col-12 col-lg-5">
                                <p className="eyebrow">About the Crust</p>
                                <h2 className="section-title">
```

**السطر 1049:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 1051:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1052:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1053:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1054:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1055:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1056:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 1057–1064

```jsx
                                    Pizza with black-shirt confidence.
                                </h2>
                            </div>

                            <div className="col-12 col-lg-7">
                                <p className="section-copy">
                                    What The Crust serves flame-baked pizza, toasted sandwiches,
                                    rich dips, and desserts through a branch-aware ordering system.
```

**السطر 1057:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 1058:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1059:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1061:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1062:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1063:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 1064:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 1065–1072

```jsx
                                    Every customer sees the correct prices and availability before checkout.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="contact" className="section-padding contact-section">
```

**السطر 1065:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 1066:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1067:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1068:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1069:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1070:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1072:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 1073–1080

```jsx
                    <div className="container">
                        <div className="contact-strip">
                            <div>
                                <p className="eyebrow">Contact</p>
                                <h2 className="section-title mb-3">Three ovens, one crust.</h2>
                                <p className="section-copy mb-0">
                                    Pick your nearest branch in the footer, order online, or drop in
                                    for a slice baked to perfection at intense heat.
```

**السطر 1073:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1074:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1075:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1076:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1077:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1078:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1079:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 1080:** Loop / حلقة مرور؛ تعيد تنفيذ الجسم حسب الشرط/العناصر. راقب المتغير الحالي وما الذي يتغيّر في كل دورة.

### السطور 1081–1088

```jsx
                                </p>
                            </div>

                            <div className="contact-actions">
                                <a href="mailto:hello@WhatTheCrust.com" className="btn btn-red">
                                    Email Us
                                </a>
                                <Link to="/menu" className="btn btn-outline-glow">
```

**السطر 1081:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1082:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1084:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1085:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 1086:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 1087:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1088:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 1089–1096

```jsx
                                    Start Order
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <CartToast show={showToast} />
```

**السطر 1089:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 1090:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1091:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1092:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1093:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1094:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1096:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 1097–1101

```jsx
            </main>
        </>
    );
}

```

**السطر 1097:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1098:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 1099:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 1100:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
