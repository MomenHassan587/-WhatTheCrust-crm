import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { demoAccounts, resetDemo } from '../demo/api';

export function DemoAccounts() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const enter = async (account) => {
        setBusy(true);
        try {
            const user = await login({ email: account.email });
            navigate(user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/menu');
        } catch (requestError) { setError(requestError.message); }
        finally { setBusy(false); }
    };
    return <main className="auth-page"><section className="auth-card p-4"><p className="eyebrow">Interactive preview</p><h1 className="h3">Choose a demo account</h1><p className="text-secondary">No signup or password needed. Use sample customer details only.</p><div className="d-grid gap-2">{demoAccounts().map((account) => <button key={account.id} type="button" className="btn btn-outline-light text-start" disabled={busy} onClick={() => enter(account)}>{account.name}</button>)}</div>{error && <p role="alert" className="text-danger mt-3">{error}</p>}</section></main>;
}

export default function DemoBar() {
    const { user } = useAuth();
    return <aside className="wtc-demo-bar" aria-label="Demo controls"><div><strong>DEMO</strong><span>Sample orders only. No payments. Data stays in this browser.</span></div><nav aria-label="Demo navigation"><Link to="/login">{user ? 'Switch account' : 'Try staff / admin'}</Link><button type="button" onClick={() => { if (window.confirm('Reset all demo orders and changes in this browser?')) { resetDemo(); window.location.reload(); } }}>Reset demo</button></nav></aside>;
}
