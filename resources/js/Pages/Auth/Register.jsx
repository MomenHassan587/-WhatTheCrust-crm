// resources/js/Pages/Auth/Register.jsx

import React, { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const submitRegister = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await register(form);
            navigate('/menu');
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="auth-page">
            <Card className="auth-card">
                <Card.Body>
                    <p className="eyebrow">Join The Crust</p>
                    <h1>Create Account</h1>
                    <p className="section-copy">
                        Register once, then order from any branch.
                    </p>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={submitRegister}>
                        <Form.Group className="mb-3" controlId="register-name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.name}
                                onChange={(event) => updateField('name', event.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="register-email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={form.email}
                                onChange={(event) => updateField('email', event.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="register-password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={form.password}
                                onChange={(event) => updateField('password', event.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="register-password-confirmation">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={form.password_confirmation}
                                onChange={(event) => updateField('password_confirmation', event.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button type="submit" className="btn-red w-100" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating account...' : 'Register'}
                        </Button>
                    </Form>

                    <p className="auth-switch">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </Card.Body>
            </Card>
        </main>
    );
}
