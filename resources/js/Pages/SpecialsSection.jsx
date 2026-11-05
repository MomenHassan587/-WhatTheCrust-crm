// resources/js/Pages/SpecialsSection.jsx

import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { motion } from 'framer-motion';

const specials = [
    {
        id: 1,
        title: 'Canivora Heat Pizza',
        description: 'Beef chunks, salami, mozzarella, basil, and rich tomato sauce.',
        price: 'EGP 235',
        icon: '🍕',
    },
    {
        id: 2,
        title: 'Truffle Melt Sandwich',
        description: 'Mushrooms, mozzarella, caramelized onion, and truffle cream.',
        price: 'EGP 139',
        icon: '🥪',
    },
    {
        id: 3,
        title: 'Hot Honey Dip',
        description: 'A sweet-heat crust dunking potion with a glossy chili finish.',
        price: 'EGP 29',
        icon: '🍯',
    },
    {
        id: 4,
        title: 'Mini Lava Cake',
        description: 'Warm chocolate cake with a molten center and dark cocoa finish.',
        price: 'EGP 79',
        icon: '🍫',
    },
];

export default function SpecialsSection() {
    return (
        <section className="section-padding specials-section">
            <div className="container">
                <div className="section-heading text-center">
                    <p className="eyebrow">Chef Specials</p>
                    <h2 className="section-title">Fresh from the heat vault.</h2>
                    <p className="section-copy mx-auto">
                        Premium picks with gold-tagged prices, deep charcoal cards, and quick-add energy.
                    </p>
                </div>

                <Row className="g-4">
                    {specials.map((item, index) => (
                        <Col key={item.id} xs={12} md={6} lg={3}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.25 }}
                                transition={{ duration: 0.45, delay: index * 0.08 }}
                            >
                                <Card className="dark-card h-100">
                                    <Card.Body>
                                        <div className="special-icon">{item.icon}</div>
                                        <strong className="price-pill">{item.price}</strong>
                                        <Card.Title>{item.title}</Card.Title>
                                        <Card.Text>{item.description}</Card.Text>
                                        <button type="button" className="btn btn-card w-100">
                                            Quick Add
                                        </button>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </div>
        </section>
    );
}