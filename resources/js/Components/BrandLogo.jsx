// resources/js/Components/BrandLogo.jsx

import React from 'react';
import { Link } from 'react-router-dom';

export default function BrandLogo() {
    return (
        <Link to="/" className="brand-logo-img-link" aria-label="What The Crust homepage">
            <img
                src="/images/logo.png"
                alt="What The Crust"
                className="brand-logo-img"
            />
        </Link>
    );
}