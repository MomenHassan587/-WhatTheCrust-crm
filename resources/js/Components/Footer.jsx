import React from 'react';
import { useCatalog } from '../context/CatalogContext';

export default function Footer() {
    const { branches, loading, error } = useCatalog();

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="site-footer-heading"><h2>Contacts<span>?</span></h2></div>
                <div className="site-footer-grid">
                    {loading && <section className="site-footer-column"><h3>Branches</h3><p>Loading locations...</p></section>}
                    {!loading && error && <section className="site-footer-column"><h3>Branches</h3><p>Locations are temporarily unavailable.</p></section>}
                    {!loading && !error && branches.map((branch) => (
                        <section className="site-footer-column" key={branch.id}>
                            <h3>{branch.name}</h3>
                            <p>{branch.location}</p>
                            <p>{branch.opening_hours || 'Opening hours coming soon'}</p>
                            {branch.phone ? <a href={`tel:${branch.phone.replace(/\s/g, '')}`}>{branch.phone}</a> : <span className="text-secondary">Phone coming soon</span>}
                        </section>
                    ))}
                    <section className="site-footer-column">
                        <h3>Email</h3>
                        <a href="mailto:hello@WhatTheCrust.com">hello@WhatTheCrust.com</a>
                    </section>
                </div>
                <div className="site-footer-bottom">
                    <span>&copy; {new Date().getFullYear()} What The Crust.</span>
                    <nav aria-label="Social links"><a href="/">Instagram</a><a href="/">Facebook</a><a href="/">TikTok</a></nav>
                </div>
            </div>
        </footer>
    );
}
