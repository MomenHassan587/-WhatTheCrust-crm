// resources/js/Components/CartDrawer.jsx

import React, { useMemo, useState } from 'react';
import { Button, Form, Offcanvas } from 'react-bootstrap';
import { csrfFetch } from '../lib/api';

const fulfillmentOptions = [
    { label: 'Delivery', value: 'delivery' },
    { label: 'Pickup (Near Restaurant)', value: 'pickup' },
    { label: 'Dine-In', value: 'dine_in' },
];

export default function CartDrawer({
    show,
    onHide,
    branch,
    cartItems,
    onIncrease,
    onDecrease,
    onRemove,
    onClear,
}) {
    const [orderType, setOrderType] = useState('delivery');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const total = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cartItems]);

    const submitOrder = async () => {
        setMessage('');

        if (!branch) {
            setMessage('Select a branch before checkout.');
            return;
        }

        if (cartItems.length === 0) {
            setMessage('Your cart is empty.');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                branch_id: branch.id,
                order_type: orderType,
                items: cartItems.map((item) => ({
                    menu_item_id: item.id,
                    quantity: item.quantity,
                })),
            };

            const response = await csrfFetch('/api/orders', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            setMessage(`Order #${response.order.id} created successfully.`);
            onClear();
        } catch (error) {
            setMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Offcanvas show={show} onHide={onHide} placement="end" className="cart-drawer">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Your Cart</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                <div className="cart-branch">
                    <span>Selected Branch</span>
                    <strong>{branch ? branch.name : 'No branch selected'}</strong>
                </div>

                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <h4>Your cart is empty.</h4>
                        <p>Add a pizza and let the cheese prophecy begin.</p>
                    </div>
                ) : (
                    <div className="cart-lines">
                        {cartItems.map((item) => (
                            <div className="cart-line" key={item.id}>
                                <div>
                                    <strong>{item.name}</strong>
                                    <span>EGP {item.price} each</span>
                                </div>

                                <div className="cart-controls">
                                    <button type="button" onClick={() => onDecrease(item.id)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button type="button" onClick={() => onIncrease(item.id)}>+</button>
                                </div>

                                <button
                                    type="button"
                                    className="remove-line"
                                    onClick={() => onRemove(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="checkout-panel">
                    <h5>Choose fulfillment</h5>

                    {fulfillmentOptions.map((option) => (
                        <Form.Check
                            key={option.value}
                            type="radio"
                            id={`fulfillment-${option.value}`}
                            label={option.label}
                            name="fulfillment"
                            value={option.value}
                            checked={orderType === option.value}
                            onChange={(event) => setOrderType(event.target.value)}
                            className="checkout-radio"
                        />
                    ))}

                    <div className="cart-total">
                        <span>Total</span>
                        <strong>EGP {total.toFixed(2)}</strong>
                    </div>

                    {message && <div className="cart-message">{message}</div>}

                    <Button
                        type="button"
                        className="btn-red w-100"
                        disabled={isSubmitting || cartItems.length === 0}
                        onClick={submitOrder}
                    >
                        {isSubmitting ? 'Sending Order...' : 'Checkout'}
                    </Button>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
}