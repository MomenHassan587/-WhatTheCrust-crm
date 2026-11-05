// resources/js/Pages/HeroSlider.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/hero-slider.css';

const slides = [
    {
        id: 1,
        title: 'Canivora Heat Pizza',
        description: 'Premium meat toppings, molten mozzarella, basil, and rich tomato sauce baked at intense heat.',
        image: '/images/canivora.jpg',
    },
    {
        id: 2,
        title: 'Pepperoni Stone Pizza',
        description: 'Crispy pepperoni cups, blistered crust, smoky cheese, and our signature red sauce.',
        image: '/images/pizza-pepperoni.jpg',
    },
    {
        id: 3,
        title: 'Margherita Flame Pizza',
        description: 'Fresh basil, tomato, creamy mozzarella, olive oil, and a perfectly baked golden crust.',
        image: '/images/pizza-margherita.jpg',
    },
];

export default function HeroSlider() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const activeSlide = useMemo(() => slides[activeIndex], [activeIndex]);

    useEffect(() => {
        if (isPaused) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % slides.length);
        }, 6500);

        return () => {
            window.clearInterval(timer);
        };
    }, [isPaused]);

    const goToSlide = (index) => {
        setActiveIndex(index);
    };

    const goToPrevious = () => {
        setActiveIndex((current) => (
            current === 0 ? slides.length - 1 : current - 1
        ));
    };

    const goToNext = () => {
        setActiveIndex((current) => (current + 1) % slides.length);
    };

    return (
        <section
            className="premium-hero-slider"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="container">
                <div className="row align-items-center min-vh-100 gy-5">
                    <div className="col-12 col-lg-6">
                        <div className="hero-copy">
                            <p className="hero-eyebrow">
                                AUTHENTIC. FLAME-BAKED. IRRESISTIBLE.
                            </p>

                            <h1 className="hero-title">
                                Hot Stone Pizza
                                <span>Made Fresh Daily</span>
                            </h1>

                            <p className="hero-description">
                                Handcrafted pizzas made with premium ingredients, baked to perfection
                                at intense heat for a blistered crust, rich sauce, and molten cheese.
                            </p>

                            <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                                <Link to="/menu" className="btn hero-btn-primary">
                                    Order Now
                                </Link>

                                <Link to="/menu" className="btn hero-btn-outline">
                                    View Menu
                                </Link>
                            </div>

                            <div className="hero-slide-caption mt-5">
                                <span>Now showcasing</span>
                                <strong>{activeSlide.title}</strong>
                                <p>{activeSlide.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="pizza-slider-stage">
                            <button
                                type="button"
                                className="slider-arrow slider-arrow-left"
                                onClick={goToPrevious}
                                aria-label="Previous pizza"
                            >
                                ‹
                            </button>

                            <div className="pizza-perspective-scene">
                                <div className="pizza-entrance" key={activeSlide.id}>
                                    <div className="pizza-turntable">
                                        <img
                                            src={activeSlide.image}
                                            alt={activeSlide.title}
                                            draggable="false"
                                            onError={(event) => {
                                                event.currentTarget.onerror = null;
                                                event.currentTarget.src = '/images/canivora.jpg';
                                            }}
                                        />
                                    </div>

                                    <div className="pizza-lighting-layer" />
                                    <div className="pizza-shadow" />

                                    <span className="floating-spice spice-a" />
                                    <span className="floating-spice spice-b" />
                                    <span className="floating-spice spice-c" />
                                </div>
                            </div>

                            <button
                                type="button"
                                className="slider-arrow slider-arrow-right"
                                onClick={goToNext}
                                aria-label="Next pizza"
                            >
                                ›
                            </button>

                            <div className="slider-dots">
                                {slides.map((slide, index) => (
                                    <button
                                        key={slide.id}
                                        type="button"
                                        className={index === activeIndex ? 'active' : ''}
                                        onClick={() => goToSlide(index)}
                                        aria-label={`Show ${slide.title}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}