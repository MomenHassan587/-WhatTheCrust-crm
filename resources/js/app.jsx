// resources/js/app.jsx

import React, { Suspense, lazy, useCallback, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import './bootstrap';
import '../css/app.css';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import MenuPage from './Pages/MenuPage';
import Cart from './Pages/Cart';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import StaffDashboard from './Pages/StaffDashboard';
import OrderTracking from './Pages/OrderTracking';
import MyOrders from './Pages/MyOrders';
import AdminLayout from './Pages/Admin/AdminLayout';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminPanel from './Pages/Admin/AdminPanel';
import { AuthProvider } from './context/AuthContext';
import { CatalogProvider } from './context/CatalogContext';
import { OrderProvider } from './context/OrderContext';

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';
const DemoBar = isDemo ? lazy(() => import('./Components/DemoBar')) : null;
const DemoAccounts = isDemo ? lazy(() => import('./Components/DemoBar').then((module) => ({ default: module.DemoAccounts }))) : null;
if (isDemo) document.body.classList.add('wtc-demo-mode');

function AppShell() {
    const location = useLocation();
    const reduceMotion = useReducedMotion();
    const isHome = location.pathname === '/';
    const previousPath = useRef(location.pathname);
    const [heroReady, setHeroReady] = useState(false);

    useLayoutEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [location.pathname]);

    const revealHero = useCallback(() => {
        setHeroReady(true);
    }, []);

    useLayoutEffect(() => {
        if (isHome && previousPath.current !== '/') {
            setHeroReady(false);
        }

        previousPath.current = location.pathname;
    }, [isHome, location.pathname]);

    return (
        <>
            <Navbar
                isVisible={!isHome || heroReady}
                reduceMotion={reduceMotion}
                animateReveal={isHome}
            />

            <Suspense fallback={<main className="auth-page">Loading demo...</main>}>
            <Routes>
                <Route path="/" element={<Home heroReady={heroReady} onHeroReady={revealHero} reduceMotion={reduceMotion} />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={isDemo ? <DemoAccounts /> : <Login />} />
                <Route path="/register" element={isDemo ? <DemoAccounts /> : <Register />} />
                <Route path="/staff" element={<StaffDashboard />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/orders/:token" element={<OrderTracking />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path=":section" element={<AdminPanel />} />
                </Route>
            </Routes>
            </Suspense>

            <Footer />
            {isDemo && <Suspense fallback={null}><DemoBar /></Suspense>}
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CatalogProvider>
                    <OrderProvider>
                        <AppShell />
                    </OrderProvider>
                </CatalogProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
