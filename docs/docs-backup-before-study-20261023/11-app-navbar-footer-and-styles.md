# Code Area: App Startup, Navbar, Footer, Views, and Global CSS

This lesson explains how the frontend starts and how the shared page frame works.

## 1. Why both `app.js` and `app.jsx` exist

### `resources/js/app.js`

```js
import './bootstrap';
```

**What it says:** Run the small local `bootstrap.js` startup file.

**Why it exists:** It is a common Laravel starter filename from an earlier/basic setup.

**If you delete it now:** The active Vite setup still starts from `app.jsx`, so the visible app does not change.

Current `vite.config.js` does not list `app.js` as an entry.

### `resources/js/app.jsx`

This is the active React entry.

It uses `.jsx` because the file contains JSX screen tags such as `<Navbar />`.

### `resources/js/bootstrap.js`

```js
window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('app-ready');
});
```

This waits for HTML then adds a body class used by CSS.

This is a local Laravel startup file.

It is **not** the Bootstrap design library.

The design library is imported separately from `bootstrap/dist/css/bootstrap.min.css`.

## 2. Imports in `app.jsx`

```jsx
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import './bootstrap';
import '../css/app.css';
```

**What it says:** Bring React tools, browser mounting, routing, motion preference, Bootstrap CSS, local startup, and project CSS.

**Why import order matters:** Bootstrap supplies base design first. Project CSS loads after and can customize it.

**If you delete ReactDOM:** The app cannot mount into HTML.

**If you delete BrowserRouter:** Route/Link hooks do not have routing context.

**If you delete app.css:** Most custom design disappears.

The next imports bring Navbar, Footer, all active pages, and AuthProvider.

## 3. `AppShell`

```jsx
const location = useLocation();
const reduceMotion = useReducedMotion();
const isHome = location.pathname === '/';
const previousPath = useRef(location.pathname);
const [heroReady, setHeroReady] = useState(false);
```

**What it says:** Read current address, user's motion preference, whether this is Home, previous path, and hero-ready state.

**Why it is there:** Navbar is hidden only while the Home video is in its early part.

**If you delete `heroReady`:** AppShell cannot coordinate Navbar and Home reveal.

`useReducedMotion()` reads an operating-system/browser accessibility preference.

## 4. Reveal callback

```jsx
const revealHero = useCallback(() => {
    setHeroReady(true);
}, []);
```

**What it says:** Make a stable function that marks Hero ready.

**Why `useCallback`:** Home's effect depends on this function. A stable function avoids restarting video on every AppShell redraw.

**If you wrote a new normal function each render:** The Hero effect dependency could change and replay unexpectedly.

## 5. Reset when returning home

```jsx
useLayoutEffect(() => {
    if (isHome && previousPath.current !== '/') {
        setHeroReady(false);
    }

    previousPath.current = location.pathname;
}, [isHome, location.pathname]);
```

**What it says:** Before browser paints, when navigation returns to Home from elsewhere, hide hero content again. Save latest path.

**Why it is there:** Returning to Home should replay its intro behavior.

**If you delete it:** Home may return with Navbar/content already revealed before its new video play.

`useLayoutEffect` runs before visible paint, reducing a flash of the wrong state.

## 6. Shared Navbar and routes

```jsx
<Navbar
    isVisible={!isHome || heroReady}
    reduceMotion={reduceMotion}
    animateReveal={isHome}
/>
```

**What it says:** Always show Navbar off Home. On Home, show only after ready. Give motion choice and reveal flag.

**Why it is there:** Header and hero share timing.

**If you change `!isHome || heroReady` incorrectly:** Navbar may stay hidden on all pages.

The `<Routes>` block maps Home, Menu, Cart, Login, Register, and StaffDashboard.

There is no catch-all React 404 page. Unknown non-API addresses receive the React shell but may show only shared Navbar/Footer with no route content.

## 7. Providers and mount

```jsx
function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppShell />
            </AuthProvider>
        </BrowserRouter>
    );
}
```

**What it says:** Give AppShell routing and auth context.

**Why wrapper order matters:** Auth children also have router access because both wrappers surround AppShell.

**If AuthProvider is removed:** `useAuth()` throws in Navbar/Staff/Login.

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

This finds Blade's root box and renders App. StrictMode gives extra development checks.

## 8. `resources/views/app.blade.php`

### Document start

```html
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
```

**What it says:** Use modern HTML. Set page language from Laravel locale.

**Why it is there:** Browser and assistive tools need document type/language.

**If doctype is deleted:** Browser may use older compatibility layout behavior.

### Head

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>What The Crust | Premium Pizza</title>
<meta name="csrf-token" content="{{ csrf_token() }}">
```

- UTF-8 supports normal text characters.
- Viewport makes mobile width behave correctly.
- Title appears in browser tab.
- CSRF meta provides secret token to `csrfFetch`.

Delete viewport and mobile pages may look zoomed-out.

Delete CSRF meta and changing requests can fail.

### Vite lines

```php
@viteReactRefresh
@vite(['resources/css/app.css', 'resources/js/app.jsx'])
```

**What it says:** Enable React refresh in development and load active CSS/JS entries through Vite.

**Why it is there:** In development, Vite serves files. In production, Laravel reads built manifest.

**If you delete second line:** React/CSS do not load.

The body contains only `<div id="root"></div>` because React builds the visible app.

## 9. `resources/views/welcome.blade.php`

This is Laravel's large default welcome page.

It contains its own HTML, SVG, links, and embedded styles.

Current `routes/web.php` returns `view('app')`, not `view('welcome')`.

Therefore this 277-line file is not the active homepage.

Deleting it currently does not affect the active route, but remove it only during intentional cleanup.

## 10. `resources/js/Components/Navbar.jsx`: imports and cart count

```jsx
import { Collapse, Container, Dropdown } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
```

These supply mobile collapse, layout container, account dropdown, animation, links/navigation, location, and auth.

```jsx
function getCartCount() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
        return savedCart.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0,
        );
    } catch {
        return 0;
    }
}
```

**What it says:** Read saved cart and add all quantities. Return zero for broken data.

**Why it is there:** Badge shows total pizzas/lines quantities, not just number of different products.

**If you use array length instead:** Quantity 4 of one item would show 1.

## 11. Navbar props and state

```jsx
export default function Navbar({
    isVisible = true,
    reduceMotion = false,
    animateReveal = false,
}) {
```

Defaults let Navbar work even when a parent omits props.

State:

- `isOpen`: mobile menu open/closed;
- `mode`: delivery or restaurant visual toggle;
- auth values from Context;
- `cartCount`: starts lazily by calling getCartCount.

The order mode toggle is visual only. It does not change Cart fulfillment state.

## 12. Cart-count effect

```jsx
useEffect(() => {
    const syncCartCount = () => {
        setCartCount(getCartCount());
    };

    window.addEventListener('storage', syncCartCount);
    window.addEventListener(CART_EVENT_NAME, syncCartCount);

    return () => {
        window.removeEventListener('storage', syncCartCount);
        window.removeEventListener(CART_EVENT_NAME, syncCartCount);
    };
}, []);
```

**What it says:** Listen for cross-tab and same-tab cart changes. Recount. Remove listeners on unmount.

**Why it is there:** Badge updates without refresh.

**If cleanup is deleted:** Duplicate listeners can collect after repeated mounts.

## 13. Mobile close and logout

`closeMobileMenu` sets false.

`logout` waits for AuthContext logout, closes menu, and navigates home. If request fails, it still closes menu.

If it used `window.location.href`, the whole page would reload. Current code correctly uses React navigation.

## 14. Active-link checks

```jsx
const isHomeActive = location.pathname === '/' && !location.hash;
const isMenuActive = location.pathname.startsWith('/menu');
const isAboutActive = location.pathname === '/' && location.hash === '#about';
const isContactActive = location.pathname === '/' && location.hash === '#contact';
```

These compare current address/path/hash.

A hash is the `#about` part pointing to an item ID on the page.

`navClass` and `mobileNavClass` add active CSS class when true.

## 15. Navbar inline CSS

Navbar contains a long `<style>` block.

Main groups:

- `.wtc-navbar-link`: desktop link color and red active underline;
- `.wtc-mobile-menu`: hamburger icon and open animation;
- `.wtc-cart-link`/badge: cart button and count bubble;
- `.wtc-logo-img`: logo size/glow;
- `.wtc-mobile-nav-panel`: premium dark collapsed menu;
- desktop/mobile media queries: hide/show correct controls.

The styles keep fixed dimensions so badges/icons do not move layout.

Deleting the style block leaves Bootstrap/global styles only and breaks much Navbar appearance.

## 16. Header reveal

```jsx
<AnimatePresence>
    {isVisible && (
        <motion.header
            className="site-header"
            initial={!animateReveal || reduceMotion
                ? false
                : { opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: reduceMotion ? 0 : 0.36, ease: 'easeOut' }}
        >
```

**What it says:** Header does not exist when hidden. On Home reveal, fade and slide down 24 pixels over 0.36 seconds. Skip motion if requested.

**Why it is there:** Hidden Navbar cannot accidentally receive clicks/focus during video.

**If you remove `isVisible` condition:** Header appears during the early hero video.

Inline style fixes header at top with transparent dark blur and high z-index.

## 17. Desktop Navbar content

Inside React Bootstrap `Container` and semantic `<nav>`:

- left area has mobile hamburger and desktop Home/Menu/About/Contact links;
- center has logo Link and image;
- right area has order mode, cart, and account.

`aria-label`, `aria-expanded`, and `aria-controls` explain navigation button to assistive tools.

## 18. Cart badge

Cart Link contains a drawn SVG shopping bag.

Badge renders only when count is above zero.

Counts over 99 display `99+` so the circle does not grow badly.

## 19. Auth dropdown

When auth checking ends:

- no user -> Login link;
- user -> Dropdown showing “Hi, name.”

Staff/admin additionally see Staff Dashboard.

All users see My Menu and Logout.

If role condition is removed, customer UI might show a staff link, but Laravel would still block the API.

## 20. Mobile Collapse

```jsx
<Collapse in={isOpen}>
    <div id="wtc-mobile-nav" className="wtc-mobile-nav-panel">
```

React Bootstrap smoothly opens/closes the menu using `isOpen`.

It repeats main links, Cart count, and staff link when appropriate.

Every link calls closeMobileMenu so panel closes after navigation.

## 21. `BrandLogo.jsx`

```jsx
export default function BrandLogo() {
    return (
        <Link to="/" className="brand-logo-img-link" aria-label="What The Crust homepage">
            <img src="/images/logo.png" alt="What The Crust" className="brand-logo-img" />
        </Link>
    );
}
```

**What it says:** Reusable homepage logo link with useful accessible text.

**Why it exists:** It can prevent repeated logo markup.

**Current truth:** Navbar writes its own logo instead and does not import BrandLogo.

Deleting BrandLogo currently does not change active screen.

## 22. `Footer.jsx`

`contactColumns` is an array with Maadi, The Drive, Lakehouse Dusit Thani, and Email.

Each location has lines and a phone link.

Email has an envelope SVG and `mailto:` link.

```jsx
{contactColumns.map((column) => (
    <section className="site-footer-column" key={column.title}>
```

This makes one semantic section per contact column. Title is stable key.

Nested map creates each address/time paragraph.

Footer bottom uses current year automatically.

Social links currently point to `/`, so they are placeholders rather than real social profiles.

The source displays an encoding problem before the copyright symbol in some output. This should be cleaned later.

## 23. `resources/css/app.css`

This is the 1,208-line global stylesheet.

It begins with reusable color variables:

```css
:root {
    --bg-primary: #121212;
    --bg-secondary: #1A1A1A;
    --accent-red: #E32626;
    --accent-gold: #F1A83A;
    --text-main: #F5F5F5;
}
```

Changing one variable updates many rules.

Main sections, in file order:

1. Universal box sizing.
2. Smooth scroll and red scrollbar.
3. Body font/background and overflow.
4. Links/buttons basics.
5. `app-ready` background.
6. Shared section spacing.
7. Older `.site-header`, nav grid, logo, mode toggle, mobile menu styles.
8. Older image hero classes used by HeroLanding.
9. Shared eyebrow, buttons, cards, headings.
10. About/contact backgrounds.
11. Footer grid and columns.
12. Menu page, branch cards, category bar, product images.
13. Old CartDrawer/offcanvas styles.
14. Login/register page and form styles.
15. Responsive rules at 1199px, 991px, and 767px.

Some active components also inject their own CSS. This creates duplicated/competing style locations. It works, but future cleanup should organize component styles.

The scrollbar rules include Firefox properties and WebKit pseudo-elements for Chrome/Edge/Safari.

## 24. `vite.config.js`

```js
export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
});
```

**What it says:** Use Laravel Vite integration and React transformation. Build from global CSS and active app.jsx. Refresh during development.

**Why it is there:** Vite needs entry points and JSX support.

**If you change input to `app.js`:** The current routed React app would no longer be the main entry unless app.js imported it.

Tailwind's package is installed, but Tailwind plugin is not added here and app.css does not import Tailwind. Tailwind is not currently active.

## What you should remember

- `app.jsx` is the active frontend entry; `app.js` is an unused older entry.
- Local `bootstrap.js` is not the Bootstrap design library.
- Blade gives React a root box, CSRF token, and Vite files.
- Navbar combines hero reveal, routing, cart count, mobile collapse, and auth UI.
- Global CSS and large component `<style>` blocks both control the design.

## Test yourself

1. Which file is the active React entry?
2. Why does AppShell own `heroReady`?
3. What is the difference between `bootstrap.js` and Bootstrap CSS?
4. Why is Navbar conditionally rendered instead of only transparent?
5. Is `welcome.blade.php` the active page?

## Answers

1. `resources/js/app.jsx`.
2. Both Home and Navbar need the same reveal timing.
3. `bootstrap.js` is a tiny local startup file. Bootstrap CSS is an installed design library.
4. An absent Navbar cannot receive hidden clicks or keyboard focus.
5. No. `app.blade.php` is the active React shell.
