# Libraries and Frameworks, Explained Simply

This lesson covers every direct package listed in `package.json` and `composer.json`.

A package is ready-made code installed for the project.

## 1. Read `package.json`

Real code:

```json
"scripts": {
    "build": "vite build",
    "dev": "vite"
}
```

**What it says:** `npm run dev` starts Vite development. `npm run build` creates production files.

**Why it is there:** Short command names are easier to remember.

**If you delete a script:** That npm command no longer exists, though the package can still be called another way.

`dependencies` are packages used by application code.

`devDependencies` are mainly tools used while developing/building.

## JavaScript packages

## 2. React

Package:

```json
"react": "^19.2.7"
```

**Simple meaning:** React builds the visible browser screen from components.

**Pizza example:** React is the system that assembles Navbar, Menu, Cart, and Staff stations.

**Project code:**

```jsx
const [paymentMethod, setPaymentMethod] = useState('cash');
```

This gives Cart changeable memory.

Important things:

- Components are functions returning JSX.
- State changes redraw the screen.
- Props pass values from parent to child.
- Hooks such as `useEffect` connect to video, timers, and browser events.
- Never change state arrays/objects directly; create new copies.

If React was removed, the active frontend could not run.

## 3. React DOM

Package:

```json
"react-dom": "^19.2.7"
```

**Simple meaning:** React DOM connects React to real browser HTML.

**Project code:**

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

React itself describes screens. React DOM places them inside Blade's root box.

The project also imports `flushSync` from React DOM so auth state finishes before navigation.

If removed, React cannot mount into the page.

## 4. React Router DOM

Package:

```json
"react-router-dom": "^7.17.0"
```

**Simple meaning:** Shows different React pages for different browser addresses without full reload.

**Pizza example:** It is the sign system pointing to Home, Menu, Cart, Login, or Staff.

**Project code:**

```jsx
<Route path="/cart" element={<Cart />} />
```

Important parts:

- `BrowserRouter` watches browser history.
- `Routes` holds address rules.
- `Route` connects path to component.
- `Link` moves without full refresh.
- `useNavigate` moves after login/logout.

## 5. Bootstrap

Package:

```json
"bootstrap": "^5.3.8"
```

**Simple meaning:** Ready-made CSS for layout, spacing, forms, and common design.

**Project code:**

```jsx
import 'bootstrap/dist/css/bootstrap.min.css';
```

Classes such as `container`, `row`, `col-12`, `d-flex`, and `mb-4` come from Bootstrap.

`col-12 col-lg-8` means full width on small screens and eight of twelve columns on large screens.

Do not confuse this package with local `resources/js/bootstrap.js`.

## 6. React Bootstrap

Package:

```json
"react-bootstrap": "^2.10.10"
```

**Simple meaning:** React components that follow Bootstrap patterns.

**Project code:**

```jsx
import { Collapse, Container, Dropdown } from 'react-bootstrap';
```

It supplies cards, rows, columns, forms, alerts, buttons, dropdowns, collapse, and old cart Offcanvas.

Bootstrap CSS gives appearance. React Bootstrap gives component behavior/structure.

## 7. Framer Motion

Package:

```json
"framer-motion": "^12.40.0"
```

**Simple meaning:** A React animation library.

**Project code:**

```jsx
<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
/>
```

It handles hero reveal, card entrance, mobile/header transitions, and new-order highlights.

Important parts:

- `motion.*` is an animatable HTML item.
- `initial` is starting look.
- `animate` is ending look.
- `exit` runs during removal.
- `AnimatePresence` allows exit animation.
- Variants reuse animation plans.

## 8. Stripe.js

Package:

```json
"@stripe/stripe-js": "^9.17.0"
```

**Simple meaning:** Stripe's official browser library.

**Project code:**

```jsx
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
```

It loads Stripe securely using the publishable key and confirms PaymentIntent.

Raw card information goes directly to Stripe.

## 9. React Stripe.js

Package:

```json
"@stripe/react-stripe-js": "^6.12.0"
```

**Simple meaning:** React components/hooks around Stripe.js.

**Project code:**

```jsx
<Elements stripe={stripePromise}>
    <CardCheckout />
</Elements>
```

`CardElement` is Stripe's hosted card input. `useStripe` and `useElements` access payment tools.

## 10. Vite

Package:

```json
"vite": "^7.0.7"
```

**Simple meaning:** Runs frontend development and builds production files.

**Pizza example:** Vite prepares all menu boards and signs before the dining room opens.

During development it gives fast refresh.

During build it makes hashed files inside `public/build` and a manifest Laravel can read.

## 11. React plugin for Vite

Package:

```json
"@vitejs/plugin-react": "^5.2.0"
```

**Simple meaning:** Teaches Vite how to understand React JSX and refresh React components.

**Project code:**

```js
plugins: [laravel(...), react()]
```

Without it, Vite does not have the intended React transformation setup.

## 12. Laravel Vite plugin

Package:

```json
"laravel-vite-plugin": "^2.0.0"
```

**Simple meaning:** Connects Laravel Blade to Vite.

It handles development server links, production manifest files, entry points, and refresh.

**Project code:**

```php
@vite(['resources/css/app.css', 'resources/js/app.jsx'])
```

## 13. Axios

Package:

```json
"axios": "^1.11.0"
```

**Simple meaning:** A library for HTTP requests.

**Current truth:** Axios is installed but not used in the active project.

The project uses the browser's built-in `fetch` through `csrfFetch`.

Keeping two request systems without need adds confusion. Axios could be removed later after checking all imports.

## 14. Tailwind CSS

Packages:

```json
"tailwindcss": "^4.0.0",
"@tailwindcss/vite": "^4.0.0"
```

**Simple meaning:** Tailwind can generate CSS from utility class names.

**Current truth:** It is installed but not configured in `vite.config.js`, and `app.css` does not import Tailwind.

Therefore Tailwind is not active.

Classes that look like Tailwind do not automatically work unless Bootstrap/custom CSS also defines the behavior.

## 15. Concurrently

Package:

```json
"concurrently": "^9.0.1"
```

**Simple meaning:** Runs several terminal programs together.

Composer's `dev` command uses it to run Laravel server, queue listener, log viewer, and Vite at once.

It is a development helper, not a customer feature.

## PHP and Composer packages

## 16. PHP

Composer requirement:

```json
"php": "^8.2"
```

PHP is the backend language. `^8.2` means compatible version 8.2 or newer within Composer's allowed major range.

Laravel controllers, models, migrations, config, routes, and tests are PHP.

## 17. Laravel Framework

Package:

```json
"laravel/framework": "^12.0"
```

**Simple meaning:** The main backend framework.

It provides:

- routing;
- controllers;
- validation;
- sessions/login;
- Eloquent database models;
- migrations;
- events and queues;
- configuration;
- testing tools.

**Project code:**

```php
Route::post('/orders', [OrderController::class, 'store']);
```

Laravel receives the request, validates it, uses services/models, and sends JSON.

## 18. Eloquent

Eloquent is part of Laravel, not a separate composer line.

**Simple meaning:** It lets PHP classes represent database rows and relationships.

**Project code:**

```php
return $this->hasMany(OrderItem::class);
```

This says one Order has many OrderItems.

## 19. Laravel Tinker

Package:

```json
"laravel/tinker": "^2.10.1"
```

**Simple meaning:** An interactive terminal where you can try Laravel/PHP commands.

Example use:

```text
php artisan tinker
App\Models\Order::latest()->first();
```

It is useful for learning/inspection. Permanent setup belongs in migrations/seeders.

## 20. Stripe PHP

Package:

```json
"stripe/stripe-php": "^21.0"
```

**Simple meaning:** Stripe's official server library.

It creates PaymentIntents and verifies webhook signatures.

**Project code:**

```php
Webhook::constructEvent($payload, $signature, $secret);
```

Never send the PHP secret key to React.

## Development-only PHP packages

## 21. Faker

Package:

```json
"fakerphp/faker": "^1.23"
```

Makes fake names and emails for tests/factories.

`UserFactory` uses `fake()->name()` and `safeEmail()`.

## 22. Laravel Pail

Package:

```json
"laravel/pail": "^1.2.2"
```

Shows Laravel logs live in a readable terminal view.

Do not log passwords, card details, or secrets.

## 23. Laravel Pint

Package:

```json
"laravel/pint": "^1.24"
```

Formats PHP code into Laravel's normal style.

It changes spacing/style, not business logic.

## 24. Laravel Sail

Package:

```json
"laravel/sail": "^1.41"
```

Runs Laravel inside Docker containers.

Docker is a way to package programs and versions together.

**Current truth:** This Windows setup appears to run PHP/Node directly. Sail is installed but not required by the shown workflow.

## 25. Mockery

Package:

```json
"mockery/mockery": "^1.6"
```

Creates fake versions of dependencies during tests and checks how they were called.

This project uses an anonymous fake PaymentGateway directly in one test; Laravel's testing stack also depends on mocking tools.

## 26. Collision

Package:

```json
"nunomaduro/collision": "^8.6"
```

Makes terminal errors and PHPUnit failures easier to read.

It changes developer output, not website behavior.

## 27. PHPUnit

Package:

```json
"phpunit/phpunit": "^11.5.50"
```

Runs PHP tests.

**Project code:**

```php
$this->actingAs($staff)
    ->getJson('/api/staff/orders')
    ->assertOk();
```

It can make requests, check JSON/status, and inspect database rows.

## 28. Packages not installed

These are sometimes discussed with this project but are not direct installed packages:

- Laravel Sanctum;
- Laravel Reverb;
- Laravel Echo;
- Pusher JS.

The app uses normal Laravel web sessions and staff polling.

## 29. Lock files

`package-lock.json` and `composer.lock` record exact dependency versions.

This helps another computer install the same set.

Do not casually delete lock files in an application project.

## What you should remember

- React/Laravel are the main frontend/backend tools.
- Vite builds the frontend; npm and Composer install packages.
- Bootstrap is active; Tailwind and Axios are installed but unused.
- Stripe has separate browser and server packages so card secrets stay separated.
- Sanctum and WebSocket client packages are not installed.

## Test yourself

1. What is the difference between npm and Composer?
2. What does Vite do?
3. Is Axios used by the active code?
4. Is Tailwind active?
5. Which Stripe package verifies webhooks?

## Answers

1. npm installs JavaScript packages. Composer installs PHP packages.
2. It runs frontend development and builds production browser files.
3. No. The project uses `fetch` through `csrfFetch`.
4. No. Its packages are installed but not configured/imported.
5. `stripe/stripe-php` on the Laravel server.
