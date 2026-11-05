import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
    ['', 'Overview'],
    ['menu', 'Menu'],
    ['branches', 'Branches'],
    ['staff', 'Staff'],
    ['orders', 'Orders'],
    ['customers', 'Customers'],
    ['settings', 'Settings'],
];

export default function AdminLayout() {
    const { user, isCheckingAuth } = useAuth();
    if (isCheckingAuth) return <main className="wtc-admin-shell"><p>Checking access...</p></main>;
    if (!user || user.role !== 'admin') return <main className="wtc-admin-shell"><section className="wtc-admin-denied"><h1>Admin access required</h1><p>This area is only available to administrators.</p></section></main>;

    return (
        <main className="wtc-admin-shell">
            <style>{`
                .wtc-admin-shell{min-height:100vh;padding-top:84px;background:#0f0f0f;color:#f5f5f5}.wtc-admin-layout{display:grid;grid-template-columns:220px minmax(0,1fr);min-height:calc(100vh - 84px)}.wtc-admin-nav{position:sticky;top:84px;height:calc(100vh - 84px);padding:1.25rem .85rem;border-right:1px solid #2c2c2c;background:#151515}.wtc-admin-brand{display:block;padding:.65rem;color:#ff5252;font-size:.72rem;font-weight:950;text-transform:uppercase}.wtc-admin-nav a{display:flex;min-height:43px;align-items:center;padding:.65rem .8rem;border-radius:5px;color:#aaa;text-decoration:none;font-weight:850}.wtc-admin-nav a:hover,.wtc-admin-nav a:focus-visible{background:#222;color:#fff}.wtc-admin-nav a.active{background:#e32626;color:#fff}.wtc-admin-content{min-width:0;padding:2rem}.wtc-admin-denied{padding:8rem 1rem;text-align:center}.wtc-admin-title{font-size:clamp(2rem,4vw,3.8rem);font-weight:1000;letter-spacing:0}.wtc-admin-card{border:1px solid #303030;border-radius:8px;background:#191919}.wtc-admin-table{width:100%;border-collapse:collapse}.wtc-admin-table th,.wtc-admin-table td{padding:.75rem;border-bottom:1px solid #303030;text-align:left;vertical-align:top}.wtc-admin-table th{color:#909090;font-size:.72rem;text-transform:uppercase}.wtc-admin-input{width:100%;min-height:42px;border:1px solid #3b3b3b;border-radius:5px;padding:.6rem .7rem;background:#101010;color:#fff}.wtc-admin-input:focus{border-color:#e32626;outline:3px solid rgba(227,38,38,.16)}.wtc-admin-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.8rem}@media(max-width:900px){.wtc-admin-shell{padding-top:72px}.wtc-admin-layout{grid-template-columns:1fr}.wtc-admin-nav{position:sticky;top:72px;z-index:20;width:100%;height:auto;display:flex;gap:.35rem;overflow-x:auto;border-right:0;border-bottom:1px solid #2c2c2c;padding:.55rem}.wtc-admin-brand{display:none}.wtc-admin-nav a{flex:0 0 auto}.wtc-admin-content{padding:1rem}.wtc-admin-grid{grid-template-columns:1fr}.wtc-admin-table-wrap{overflow-x:auto}}
            `}</style>
            <div className="wtc-admin-layout">
                <nav className="wtc-admin-nav" aria-label="Admin navigation"><span className="wtc-admin-brand">Admin control</span>{links.map(([path, label]) => <NavLink key={label} end={!path} to={path}>{label}</NavLink>)}</nav>
                <section className="wtc-admin-content"><Outlet /></section>
            </div>
        </main>
    );
}
