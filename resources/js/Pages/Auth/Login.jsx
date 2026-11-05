// resources/js/Pages/Auth/Login.jsx

import React, { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const submitLogin = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const user = await login(form);
            navigate(user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/menu', { replace: true });
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
                    <p className="eyebrow">Welcome Back</p>
                    <h1>Login</h1>
                    <p className="section-copy">
                        Enter the crust chamber and continue your order.
                    </p>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={submitLogin}>
                        <Form.Group className="mb-3" controlId="login-email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={form.email}
                                onChange={(event) => updateField('email', event.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="login-password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={form.password}
                                onChange={(event) => updateField('password', event.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Check
                            className="mb-4"
                            type="checkbox"
                            id="remember-me"
                            label="Remember me"
                            checked={form.remember}
                            onChange={(event) => updateField('remember', event.target.checked)}
                        />

                        <Button type="submit" className="btn-red w-100" disabled={isSubmitting}>
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form>

                    <p className="auth-switch">
                        No account yet? <Link to="/register">Create one</Link>
                    </p>
                </Card.Body>
            </Card>
        </main>
    );
}
