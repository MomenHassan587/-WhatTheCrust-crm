// resources/js/Pages/HeroLanding.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const textWrap = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const textItem = {
    hidden: {
        opacity: 0,
        x: -34,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.58,
            ease: 'easeOut',
        },
    },
};

const toppingDrop = {
    hidden: {
        opacity: 0,
        y: -220,
        rotate: -40,
        scale: 0.75,
    },
    visible: (delay) => ({
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: 1,
        transition: {
            delay,
            type: 'spring',
            stiffness: 115,
            damping: 9,
            mass: 0.8,
        },
    }),
};

export default function HeroLanding() {
    return (
        <section className="hero-canvas">
            <div className="hero-texture" aria-hidden="true" />
            <div className="hero-smoke hero-smoke-one" aria-hidden="true" />
            <div className="hero-smoke hero-smoke-two" aria-hidden="true" />

            <div className="container-fluid px-0">
                <div className="hero-organic-grid">
                    <motion.div
                        className="hero-copy"
                        variants={textWrap}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.p className="eyebrow" variants={textItem}>
                            Authentic. Flame-Baked. Irresistible.
                        </motion.p>

                        <motion.h1 variants={textItem}>
                            Hot Stone Pizza
                            <span>Made Fresh Daily</span>
                        </motion.h1>

                        <motion.p className="hero-description" variants={textItem}>
                            Handcrafted pizzas made with premium ingredients, baked to perfection
                            at intense heat for a blistered crust, rich sauce, and molten cheese.
                        </motion.p>

                        <motion.div className="hero-actions" variants={textItem}>
                            <Link to="/menu" className="btn btn-red btn-lg">
                                Order Now
                            </Link>

                            <Link to="/menu" className="btn btn-outline-glow btn-lg">
                                View Menu
                            </Link>
                        </motion.div>

                        <motion.div className="hero-stats" variants={textItem}>
                            <div>
                                <span>🔥</span>
                                <strong>Flame-Baked</strong>
                                <small>Intense heat, bold crust</small>
                            </div>

                            <div>
                                <span>🌿</span>
                                <strong>Fresh Ingredients</strong>
                                <small>Sourced daily, always bright</small>
                            </div>

                            <div>
                                <span>🛵</span>
                                <strong>Fast Delivery</strong>
                                <small>Hot, fresh, and on time</small>
                            </div>
                        </motion.div>
                    </motion.div>

                    <div className="hero-pizza-zone">
                        <div className="pizza-blend-mask" aria-hidden="true" />

                        <motion.div
                            className="pizza-hero-disk"
                            initial={{ opacity: 0, scale: 0.88, rotate: 12, x: 90 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0, x: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <img
                                src="/images/canivora.jpg"
                                alt="Canivora hot stone baked pizza"
                                className="hero-pizza-img"
                            />
                        </motion.div>

                        <motion.span
                            className="falling-topping salami salami-one"
                            variants={toppingDrop}
                            custom={0.7}
                            initial="hidden"
                            animate="visible"
                            aria-hidden="true"
                        />

                        <motion.span
                            className="falling-topping salami salami-two"
                            variants={toppingDrop}
                            custom={0.85}
                            initial="hidden"
                            animate="visible"
                            aria-hidden="true"
                        />

                        <motion.span
                            className="falling-topping salami salami-three"
                            variants={toppingDrop}
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            aria-hidden="true"
                        />

                        <motion.span
                            className="falling-topping meat meat-one"
                            variants={toppingDrop}
                            custom={1.1}
                            initial="hidden"
                            animate="visible"
                            aria-hidden="true"
                        />

                        <motion.span
                            className="falling-topping meat meat-two"
                            variants={toppingDrop}
                            custom={1.25}
                            initial="hidden"
                            animate="visible"
                            aria-hidden="true"
                        />

                        <motion.span
                            className="falling-topping meat meat-three"
                            variants={toppingDrop}
                            custom={1.38}
                            initial="hidden"
                            animate="visible"
                            aria-hidden="true"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}