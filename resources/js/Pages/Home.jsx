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
