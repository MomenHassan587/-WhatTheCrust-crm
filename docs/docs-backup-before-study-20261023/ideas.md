# What The Crust: Product Audit and Improvement Ideas

Audit date: October 9, 2026

This document is a product and technical review of the current code in `D:\Work\Projects\pizza-crm`.

No application code was changed during this review.

## Executive summary

The project has a stronger backend foundation than the visible website suggests. It already has guest ordering, session authentication, staff roles, server-side price checks, Stripe Payment Intents, payment webhooks, order status history, staff filters, and notification polling.

The biggest problem is not a missing animation or page. It is **data consistency**.

The customer menu is hard-coded in React and does not match the Laravel database. For example, React presents menu item ID `1` as **Canivora Heat Pizza**, while the database seeds item ID `1` as **Red Hook Margherita**. The browser can therefore show one product while Laravel prices and saves another product. This must be fixed before treating the ordering flow as production-ready.

There is also a presentation blocker in the current local setup. `.env` selects MySQL and database sessions, but the MySQL service was unavailable during this audit. Every page returned Laravel's detailed 500 error screen until the app was launched temporarily with SQLite and file sessions. The temporary launch did not edit the project.

## 1. Features that exist today

### Application structure

- A Laravel 12 backend serves a React 19 single-page application.
- Vite builds the frontend.
- React Router provides `/`, `/menu`, `/cart`, `/login`, `/register`, and `/staff`.
- Bootstrap and React Bootstrap provide layout and form components.
- Framer Motion provides reveal, card, toast, and dashboard animations.
- Laravel web sessions and CSRF protection are used for authentication. Sanctum is not installed.
- SQLite is the default in `.env.example`, although the current local `.env` selects MySQL.

Main files: `routes/web.php`, `resources/js/app.jsx`, `resources/views/app.blade.php`, `vite.config.js`, `package.json`, and `composer.json`.

### Homepage and navigation

- The homepage opens with an eight-second pizza video.
- The video is muted, plays once, reveals the topbar and hero copy around 1.2 seconds, slows from six to eight seconds, and remains on its final frame.
- Video errors and blocked autoplay reveal the navigation and copy instead of leaving the page unusable.
- The hero includes a tagline, headline, description, calls to action, and three product promises.
- The homepage includes an awards showcase, four featured products, an About section, and a Contact section.
- Featured items can be added directly to the browser cart.
- The navbar is fixed, responsive, animated, and has desktop and mobile navigation.
- The navbar displays the cart quantity and the current logged-in user.
- Staff and admin users receive a Staff Dashboard link.
- The footer shows three locations, phone numbers, opening times, email, and social-link placeholders.
- The scrollbar is styled red to match the brand.

Main files: `resources/js/Pages/Home.jsx`, `resources/js/Components/Navbar.jsx`, `resources/js/Components/Footer.jsx`, `resources/css/app.css`, and `public/videos/hero-pizza-motion.mp4`.

### Menu and cart

- The menu asks the customer to select a branch before showing products.
- Categories include pizzas, sandwiches, drinks, dips, and desserts.
- Product availability and prices change by the selected branch in the React data.
- Menu cards animate into view and display a product tag, description, price, and Add to Cart button.
- Adding an item displays a success toast.
- The cart is saved in `localStorage`, so it survives navigation and refreshes in the same browser.
- A custom browser event updates the navbar cart count immediately.
- The cart supports quantity changes, removing items, clearing the cart, and a 200-character note for each item.
- Laravel also exposes a database-driven `/api/menu` endpoint with branches, categories, branch prices, and availability.

Main files: `resources/js/Pages/MenuPage.jsx`, `resources/js/Pages/Home.jsx`, `resources/js/Pages/Cart.jsx`, `resources/js/Components/Navbar.jsx`, `app/Http/Controllers/Api/MenuController.php`, and `database/seeders/MenuCatalogSeeder.php`.

### Checkout and fulfillment

- Checkout supports guest customers and logged-in customers.
- Customers choose a branch.
- Customers choose Delivery or Pickup.
- Delivery requires an address.
- Pickup requires an estimated arrival date and time.
- Each pizza line can include kitchen notes.
- The browser displays subtotal, delivery fee, and total.
- Laravel recalculates prices from `branch_menu_item`, verifies availability, and adds the configured delivery fee.
- Order creation is wrapped in a database transaction.
- Pickup validation requires at least 20 minutes of preparation time.
- The minimum preparation time and delivery fee are configurable.

Main files: `resources/js/Pages/Cart.jsx`, `app/Http/Requests/StoreOrderRequest.php`, `app/Services/Orders/OrderCreator.php`, `app/Http/Controllers/Api/OrderController.php`, and `config/orders.php`.

### Card payments

- Checkout offers cash and Stripe card payment.
- Stripe's hosted Card Element collects card details, so raw card data does not pass through Laravel.
- Laravel creates the Payment Intent using the server-calculated order total.
- A `PaymentGateway` interface separates the application from Stripe-specific code.
- Card requests require an idempotency key.
- Card orders start as `payment_pending` and do not appear to staff until payment succeeds.
- A signed Stripe webhook marks the order paid and changes it to `new`.
- Duplicate success webhooks do not create duplicate status log entries.
- Failed payment events mark payment status as failed.

Main files: `resources/js/Pages/Cart.jsx`, `app/Contracts/PaymentGateway.php`, `app/Services/Payments/StripePaymentGateway.php`, `app/Http/Controllers/Api/PaymentController.php`, `config/services.php`, and `app/Providers/AppServiceProvider.php`.

### Login, registration, and roles

- Customers can register, log in, stay logged in with Remember Me, and log out.
- Laravel regenerates the session after login and invalidates it on logout.
- React keeps the current user in `AuthContext`, so the navbar updates without a page refresh.
- Staff and admin users are redirected to `/staff` after login.
- Users have `customer`, `staff`, or `admin` roles.
- Staff API routes require authentication and the `staff` or `admin` role.
- A staff seeder creates an initial staff account.

Main files: `resources/js/context/AuthContext.jsx`, `resources/js/Pages/Auth/Login.jsx`, `resources/js/Pages/Auth/Register.jsx`, `app/Http/Controllers/Api/AuthController.php`, `app/Http/Middleware/RequireRole.php`, `app/Models/User.php`, and `database/seeders/StaffUserSeeder.php`.

### Staff dashboard and order operations

- The staff dashboard is protected in both the React UI and Laravel API.
- Staff can filter orders by branch and date.
- Orders are grouped into status tabs.
- Cards show order number, time, customer, phone, branch, fulfillment method, address or pickup time, item notes, payment state, and total.
- The status flow supports new, accepted, preparing, ready, out for delivery or picked up, completed, cancelled, and rejected.
- Laravel checks every transition instead of trusting the browser buttons.
- Cancelling or rejecting requires a reason.
- Every accepted status change is written to `order_status_logs` with the acting user.
- The browser polls every seven seconds for new orders.
- New cards are highlighted and can trigger a short notification sound after the browser allows audio.
- Laravel broadcast events and a private `staff.orders` channel exist for future WebSocket use.

Main files: `resources/js/Pages/StaffDashboard.jsx`, `app/Http/Controllers/Api/StaffOrderController.php`, `app/Http/Requests/UpdateOrderStatusRequest.php`, `app/Models/Order.php`, `app/Models/OrderStatusLog.php`, `app/Events/OrderPlaced.php`, `app/Events/OrderStatusUpdated.php`, and `routes/channels.php`.

### Database, seed data, and tests

- The database contains users, sessions, branches, categories, menu items, branch prices and availability, orders, order items, payment fields, roles, and status logs.
- Seeders create three branches, five categories, eighteen menu items, branch pricing, branch availability, and a staff user.
- Feature tests cover role protection, valid status transitions and logs, pickup preparation time, item notes, and duplicate successful webhooks.
- The current suite passes: 6 tests and 19 assertions.

Main files: `database/migrations/`, `database/seeders/`, `tests/Feature/OrderOperationsTest.php`, and `phpunit.xml`.

## 2. Weak spots and unfinished flows

### Critical product and data risks

1. **The React menu and database catalog disagree.** Product IDs, names, prices, and availability are duplicated. Item ID `1` is Canivora in React but Margherita in the database. Staff can receive a different item from the one the customer saw.
2. **Branch names disagree across the site.** Menu, cart, staff filters, database seeders, and footer do not describe the same three locations. The footer says Maadi, The Drive, and Lakehouse. Ordering uses Nasr City, New Cairo, and Maadi.
3. **The cart is not branch-safe.** It can contain products added from different branches, then checkout defaults to branch `1`. Existing cart lines are not cleared or revalidated when the branch changes.
4. **Homepage quick-add has no branch selection.** It adds hard-coded IDs and prices without a branch. Checkout later assigns a branch, and Laravel may reinterpret or reject the product.
5. **Historical order lines are fragile.** Deleting a menu item cascades into `order_items`, and deleting a branch cascades into orders. Order items do not save a product-name snapshot. Historical receipts can change or disappear.

### Customer flow gaps

- There is no order-success page. Cash checkout only displays a message inside the cart.
- There is no customer order tracking, order history, reorder action, account page, saved address, or saved preferred branch.
- There is no product detail screen, pizza size, crust choice, topping selection, allergen information, or dietary labels.
- There is no menu search, price filter, dietary filter, popular sorting, or favorites.
- Drinks exists as a category but has no seeded or visible products.
- Menu product images are empty, so cards show the same pizza emoji placeholder.
- The topbar Delivery/Order at Restaurant switch is visual state only. It does not change menu, cart, fulfillment, pricing, or routing.
- The footer social links all point to `/` instead of real destinations.
- There is no custom 404 page.

### Checkout and payment gaps

- Browser totals use hard-coded prices and a hard-coded EGP 25 fee. Laravel may calculate a different trusted total without showing the revised amount before submission.
- Customer name, phone, and address are not prefilled from a logged-in account.
- Phone validation only checks that a string exists and is at most 40 characters.
- Delivery does not validate a service area, delivery distance, branch coverage, or estimated delivery time.
- Branch opening hours are not stored. The validator checks `opens_at` and `closes_at` only if those columns happen to exist, so that rule is currently inactive.
- Laravel uses UTC, while the browser creates Cairo local `datetime-local` values. Pickup times can be interpreted incorrectly unless a timezone contract is added.
- Cash orders have no idempotency protection against retries or double submissions.
- A new card idempotency key is created on every retry. A failed confirmation can leave abandoned `payment_pending` orders and create more orders on the next attempt.
- Card checkout treats any Stripe result without `result.error` as success. It does not explicitly require `paymentIntent.status === 'succeeded'` or present pending states accurately.
- The cart is cleared before the webhook is guaranteed to have promoted the order to `new`.
- There is no payment recovery page, cancellation flow, refund flow, or staff reconciliation view.

### Staff and CRM gaps

- The browser does not connect to the existing broadcast events. It polls every seven seconds because Echo, Reverb, and Pusher client setup are absent.
- There is no full order detail panel, printable kitchen ticket, status timeline, or customer-contact history.
- Reject/cancel uses `window.prompt`, which feels unfinished and is weak for accessibility and error recovery.
- Staff filters and branches are hard-coded in React instead of coming from the API.
- Orders are not paginated. A busy day will load every matching order and all relationships.
- Two staff members can update the same order from stale states because status updates do not lock the row or use optimistic concurrency.
- There is no menu, price, availability, category, branch, hours, staff-account, or role-management interface.
- There is no customer CRM view, notes, tags, lifetime value, complaints, or reorder history.
- There are no operational metrics for acceptance time, preparation time, late orders, cancellation rate, sales, or the brand's three-minute promise.
- The sound control is confusing: it starts with no audio context, and its label/pressed meaning does not clearly communicate whether sound is enabled.

### Design, accessibility, and performance gaps

- The menu first viewport spends a large amount of space explaining branch selection before showing actionable branch cards.
- Checkout shows the full branch and fulfillment form even when the cart is empty.
- Product photography is missing from the main menu.
- Several source images are about 2.1 MB, the hero video is about 6.7 MB, and the hero uses `preload="auto"`.
- The hero has no lightweight poster and hides navigation until media time reaches 1.2 seconds. A stalled connection that never throws an error can delay navigation indefinitely.
- Reduced-motion handling is applied to the hero reveal, but many other Framer Motion effects do not consistently respect the user's preference.
- CSS is split between a large global file and very large component-level `<style>` strings. `Home.jsx` and `Navbar.jsx` are especially difficult to maintain.
- Brand and branch content is duplicated in several React files.
- Old inactive components and assets remain, including HeroLanding, HeroSlider, SpecialsSection, CartDrawer, hero-slider CSS, and an old ending-loop video.
- The React console reports a missing unique `key` in the Cart branch option list.
- The empty `public/favicon.ico` and limited metadata make the project feel unfinished in a browser tab or shared link.

### Security and quality gaps

- Login, registration, public order creation, and Payment Intent creation have no explicit route rate limits.
- Password reset and email verification tables/configuration exist, but no user flow is implemented.
- `.env.example` contains a known default staff password. It is acceptable for an explicit local demo only, but unsafe if copied into a deployed environment.
- The current local `.env` has `APP_DEBUG=true`; the failed database connection displayed a detailed exception page. Production must never expose this.
- Staff authorization uses a broad role string check rather than policies or permissions for specific actions.
- Webhook tests fake signature parsing. There is no test for invalid signatures, amount/currency mismatches, failed intents, abandoned intents, or event ordering.
- There are no frontend component or end-to-end tests.
- There is no continuous-integration workflow, formatter check, static analysis, or automated accessibility test.
- There is no structured production error reporting or payment/order alerting.

### Presentation-readiness gaps

- The current `.env` expects unavailable MySQL and database sessions, so the project returned HTTP 500 during the live audit.
- `.env.example` says SQLite, but the active local environment says MySQL. The project needs one reliable demo setup.
- There is no health checklist that verifies database, migrations, seed data, Stripe mode, and frontend build before a presentation.
- The sample staff login is not explained on-screen in a safe demo-only way.
- There is no seeded demonstration order history, including delivery, pickup, paid, rejected, and completed examples.
- The existing tests are useful but too small to prove the complete presentation flow.

## 3. Twenty-five improvement ideas

### Customer experience

#### 1. Make the API the single source of truth for the menu

- **What:** Remove the hard-coded menu and branch arrays from React. Load branches, categories, products, prices, and availability from `/api/menu`. Add API fields for image, tag, and display order.
- **Why it matters:** This fixes the current product-ID mismatch and prevents the customer and kitchen from seeing different products.
- **Existing files touched:** `resources/js/Pages/MenuPage.jsx`, `resources/js/Pages/Home.jsx`, `app/Http/Controllers/Api/MenuController.php`, `app/Models/MenuItem.php`, `database/seeders/MenuCatalogSeeder.php`, and new menu-item migration/API resource files.
- **Effort:** Medium
- **Impact:** High

#### 2. Create one persistent branch and order-mode experience

- **What:** Store the selected branch and fulfillment mode in a shared React context. Make the navbar switch, menu, homepage quick-add, cart, and footer use that same state. Add branch hours and service details to the API.
- **Why it matters:** Customers should not repeatedly select a branch or discover at checkout that their cart belongs somewhere else.
- **Existing files touched:** `resources/js/app.jsx`, `resources/js/Components/Navbar.jsx`, `resources/js/Components/Footer.jsx`, `resources/js/Pages/Home.jsx`, `resources/js/Pages/MenuPage.jsx`, `resources/js/Pages/Cart.jsx`, `app/Models/Branch.php`, and `MenuController.php`.
- **Effort:** Medium
- **Impact:** High

#### 3. Add product details and pizza customization

- **What:** Add a product drawer/page with size, crust, extra toppings, removals, quantity, allergens, dietary labels, and calculated price.
- **Why it matters:** Pizza ordering normally requires choices. Notes alone are ambiguous for the kitchen and cannot safely change price.
- **Existing files touched:** `resources/js/Pages/MenuPage.jsx`, `resources/js/Pages/Cart.jsx`, `app/Models/MenuItem.php`, `app/Models/OrderItem.php`, `StoreOrderRequest.php`, `OrderCreator.php`, and new option/topping migrations and endpoints.
- **Effort:** Large
- **Impact:** High

#### 4. Add customer order confirmation, tracking, history, and reorder

- **What:** Create a clear success page, a live status timeline, authenticated order history, guest tracking by secure token, and Reorder.
- **Why it matters:** Customers currently lose context after checkout and cannot tell whether an order is accepted or ready.
- **Existing files touched:** `resources/js/app.jsx`, `resources/js/Pages/Cart.jsx`, `resources/js/context/AuthContext.jsx`, `app/Models/Order.php`, `OrderController.php`, `routes/web.php`, and new order pages/controllers/routes.
- **Effort:** Large
- **Impact:** High

#### 5. Improve menu discovery

- **What:** Add search, dietary/allergen filters, category counts, popular/new labels, sensible empty states, and optional favorites for logged-in users.
- **Why it matters:** A professional menu helps customers decide quickly instead of making them click through empty categories.
- **Existing files touched:** `resources/js/Pages/MenuPage.jsx`, `MenuController.php`, `MenuItem.php`, `Category.php`, and possibly new favorites migration/model files.
- **Effort:** Medium
- **Impact:** Medium

### Checkout and payments

#### 6. Make the cart branch-safe and server-quoted

- **What:** Give the cart one required branch, block mixed-branch items, revalidate lines when branch changes, and request a server quote before payment. Show any price or availability change clearly.
- **Why it matters:** This prevents stale browser prices, rejected checkout, and orders being sent to the wrong branch.
- **Existing files touched:** `resources/js/Pages/Home.jsx`, `MenuPage.jsx`, `Cart.jsx`, `resources/js/Components/Navbar.jsx`, `OrderCreator.php`, `StoreOrderRequest.php`, and a new quote endpoint in `routes/web.php`.
- **Effort:** Medium
- **Impact:** High

#### 7. Turn checkout into a guided, validated flow

- **What:** Use clear steps for cart, fulfillment, customer details, payment, and review. Prefill logged-in customer data, validate Egyptian phone numbers, use inline field errors, and keep the submit action visible on mobile.
- **Why it matters:** The current dense summary panel hides errors in one general message and asks for details even when the cart is empty.
- **Existing files touched:** `resources/js/Pages/Cart.jsx`, `resources/js/context/AuthContext.jsx`, `resources/js/lib/api.js`, `AuthController.php`, and `StoreOrderRequest.php`.
- **Effort:** Medium
- **Impact:** High

#### 8. Model branch hours, delivery zones, and time slots correctly

- **What:** Store branch timezone, weekly hours, closures, delivery zones, capacity, and available pickup/delivery slots. Return slots from Laravel instead of accepting any browser date.
- **Why it matters:** This removes the UTC/Cairo ambiguity and stops orders outside opening hours or outside a branch's service area.
- **Existing files touched:** `app/Models/Branch.php`, `StoreOrderRequest.php`, `config/app.php`, `config/orders.php`, `resources/js/Pages/Cart.jsx`, seeders, and new branch-hours/service-zone migrations and endpoints.
- **Effort:** Large
- **Impact:** High

#### 9. Harden the complete payment lifecycle

- **What:** Persist one checkout idempotency key, verify explicit Stripe statuses, expire abandoned intents, reconcile webhook amount/currency/order metadata, support retry, and add cancellation/refund records.
- **Why it matters:** The current retry flow can create abandoned pending orders, and the browser can announce success before the webhook finishes.
- **Existing files touched:** `resources/js/Pages/Cart.jsx`, `PaymentController.php`, `StripePaymentGateway.php`, `PaymentGateway.php`, `Order.php`, `OrderCreator.php`, and new payment-attempt/refund migrations and tests.
- **Effort:** Large
- **Impact:** High

#### 10. Add transparent pricing, promotions, and receipts

- **What:** Return item subtotal, delivery fee, discounts, tax if applicable, and final total from Laravel. Add promo-code rules and downloadable/email receipts.
- **Why it matters:** Customers need a trusted total before they pay, and promotions are a normal growth tool for a restaurant.
- **Existing files touched:** `resources/js/Pages/Cart.jsx`, `OrderCreator.php`, `config/orders.php`, `Order.php`, mail configuration, and new promotion/receipt classes and migrations.
- **Effort:** Large
- **Impact:** Medium

### Staff and admin tools (CRM)

#### 11. Connect true live order updates with a polling fallback

- **What:** Configure Reverb, Echo, and the private staff channel in React. Keep the current seven-second polling as a fallback when the socket is unavailable.
- **Why it matters:** Kitchen staff should see paid/new orders immediately without unnecessary repeated full-list requests.
- **Existing files touched:** `resources/js/Pages/StaffDashboard.jsx`, `resources/js/bootstrap.js`, `app/Events/OrderPlaced.php`, `OrderStatusUpdated.php`, `routes/channels.php`, `config/broadcasting.php` if added, `package.json`, and `.env.example`.
- **Effort:** Medium
- **Impact:** High

#### 12. Build a proper staff order workspace

- **What:** Add an order detail drawer, large kitchen-safe actions, status timeline, structured reject/cancel modal, printable ticket, elapsed-time indicators, and optimistic conflict handling.
- **Why it matters:** Tiny cards and `window.prompt` are not suitable for a busy kitchen or customer-support workflow.
- **Existing files touched:** `resources/js/Pages/StaffDashboard.jsx`, `StaffOrderController.php`, `UpdateOrderStatusRequest.php`, `Order.php`, `OrderStatusLog.php`, and new staff components.
- **Effort:** Medium
- **Impact:** High

#### 13. Add admin menu, branch, price, and availability management

- **What:** Create admin screens and APIs for products, categories, images, branch prices, stock/availability, opening hours, and temporary sold-out state.
- **Why it matters:** Removing hard-coded React data only works long-term if authorized staff can maintain the catalog without editing code.
- **Existing files touched:** `routes/web.php`, `RequireRole.php`, `MenuController.php`, `Branch.php`, `Category.php`, `MenuItem.php`, branch pivot data, and new admin controllers, requests, React pages, and tests.
- **Effort:** Large
- **Impact:** High

#### 14. Add a customer CRM view

- **What:** Let authorized staff search customers by name/phone/email and view order history, total spend, favorite branch/items, service notes, tags, and complaints.
- **Why it matters:** This turns the project from a kitchen board into a real customer relationship tool.
- **Existing files touched:** `app/Models/User.php`, `Order.php`, staff routes/controllers, `resources/js/Pages/StaffDashboard.jsx`, and new CRM pages, models, permissions, and tests.
- **Effort:** Large
- **Impact:** High

#### 15. Add operational analytics and the three-minute SLA

- **What:** Track accepted, preparation, ready, dispatch, and completion durations. Show late-order alerts, branch throughput, average ticket, cancellations, payment mix, and daily sales.
- **Why it matters:** The brand promise is speed. The dashboard should measure and protect that promise instead of only displaying statuses.
- **Existing files touched:** `OrderStatusLog.php`, `Order.php`, `StaffOrderController.php`, `resources/js/Pages/StaffDashboard.jsx`, and new analytics endpoints/components/indexes.
- **Effort:** Large
- **Impact:** High

### Design and animation

#### 16. Create a small reusable design system

- **What:** Define shared color, type, spacing, focus, button, field, card, toast, modal, and motion tokens. Extract large inline style blocks into focused CSS/components.
- **Why it matters:** The site currently mixes Bootstrap, global CSS, and hundreds of lines of component CSS, causing visual drift and making changes risky.
- **Existing files touched:** `resources/css/app.css`, `Home.jsx`, `Navbar.jsx`, `MenuPage.jsx`, `Cart.jsx`, `StaffDashboard.jsx`, and new shared UI components.
- **Effort:** Medium
- **Impact:** High

#### 17. Replace placeholders with optimized product media

- **What:** Add consistent food photography, responsive WebP/AVIF sizes, lazy loading, meaningful alt text, lightweight posters, and image upload/crop rules for admin.
- **Why it matters:** The menu currently uses emoji placeholders, while several existing images are over 2 MB. Food quality must be visible without slowing the page.
- **Existing files touched:** `public/images/`, `MenuPage.jsx`, `Home.jsx`, `MenuItem.php`, `MenuController.php`, and admin media fields/storage configuration.
- **Effort:** Medium
- **Impact:** High

#### 18. Make motion fast, accessible, and performance-aware

- **What:** Use shared 150-400 ms motion tokens, respect reduced motion everywhere, add a hero poster and timeout fallback, lazy-load below-fold media, and split the JavaScript bundle by route.
- **Why it matters:** The hero can delay navigation on a stalled video, and animation should support the speed message without harming accessibility or load time.
- **Existing files touched:** `resources/js/app.jsx`, `Home.jsx`, `MenuPage.jsx`, `StaffDashboard.jsx`, `resources/css/app.css`, `vite.config.js`, and hero/media assets.
- **Effort:** Medium
- **Impact:** High

#### 19. Polish navigation, footer, empty states, and accessibility

- **What:** Make the order-mode switch functional, add real social links, improve focus/contrast, fix semantic tab behavior, add a 404 page, simplify the menu first viewport, hide checkout controls for an empty cart, and fix React key warnings.
- **Why it matters:** These details are small individually but strongly affect whether the product feels finished and trustworthy.
- **Existing files touched:** `Navbar.jsx`, `Footer.jsx`, `MenuPage.jsx`, `Cart.jsx`, `StaffDashboard.jsx`, `app.jsx`, and `resources/css/app.css`.
- **Effort:** Medium
- **Impact:** Medium

### Security and quality

#### 20. Harden authentication and staff access

- **What:** Add rate limits, forgot/reset password, optional email verification, password strength feedback, forced staff password change, session/device management, and finer permissions for admin actions.
- **Why it matters:** A public login and a known seeded staff password are not sufficient for a deployed CRM containing customer phone numbers and addresses.
- **Existing files touched:** `routes/web.php`, `AuthController.php`, `RequireRole.php`, `User.php`, auth configuration, `StaffUserSeeder.php`, Login/Register pages, and new requests/pages/tests.
- **Effort:** Large
- **Impact:** High

#### 21. Protect historical data and concurrent updates

- **What:** Snapshot product name/options on order items, stop destructive branch/menu cascades, add order status versioning or row locks, constrain status/payment values, and add useful query indexes.
- **Why it matters:** Completed orders are business records. Catalog deletion or simultaneous staff actions must not rewrite or corrupt them.
- **Existing files touched:** order/menu/branch migrations, `Order.php`, `OrderItem.php`, `OrderCreator.php`, `StaffOrderController.php`, and feature tests.
- **Effort:** Medium
- **Impact:** High

#### 22. Expand automated testing and continuous integration

- **What:** Add tests for menu parity, auth, throttling, branch-safe carts, cash/card idempotency, Stripe failures, timezone rules, concurrent status changes, React components, and full browser checkout. Run them with formatting/static checks in CI.
- **Why it matters:** Six passing backend tests are a good start, but they do not cover the highest-risk customer flows.
- **Existing files touched:** `tests/`, `phpunit.xml`, `package.json`, `composer.json`, React source files for testability, and a new CI workflow.
- **Effort:** Large
- **Impact:** High

#### 23. Add production configuration, security headers, and observability

- **What:** Provide safe production environment guidance, disable debug, add CSP/security headers, structured error reporting, payment alerts, health/readiness endpoints, logs without sensitive data, and backup/restore instructions.
- **Why it matters:** The current database failure exposed a detailed Laravel exception page. Production failures should be safe, visible to maintainers, and recoverable.
- **Existing files touched:** `.env.example`, `bootstrap/app.php`, logging/session/database config, middleware, health route, deployment documentation, and an error-reporting integration.
- **Effort:** Medium
- **Impact:** High

### Presentation-readiness

#### 24. Create one reliable demo setup

- **What:** Standardize the presentation on SQLite or document/start MySQL automatically. Add one setup command that checks environment, migrates, seeds, builds, and verifies the health endpoint. Seed realistic example orders in every important state.
- **Why it matters:** A polished product cannot be presented if the first page is a database 500 error.
- **Existing files touched:** `.env.example`, `composer.json`, `database/seeders/DatabaseSeeder.php`, new demo-order seeder, `README.md`, and optional setup scripts.
- **Effort:** Small
- **Impact:** High

#### 25. Finish the browser and presentation surface

- **What:** Add a real favicon, social/SEO metadata, share image, branded loading/error/404 pages, a safe demo-account note, concise architecture diagram, demo script, and pre-demo checklist.
- **Why it matters:** These are the first and last details reviewers notice, and they make the project easier to explain confidently.
- **Existing files touched:** `public/favicon.ico`, `resources/views/app.blade.php`, `resources/js/app.jsx`, auth/staff pages, `README.md`, and `docs/`.
- **Effort:** Small
- **Impact:** Medium

## 4. Recommended top eight in build order

### 1. Make the project start reliably for development and presentations (Idea 24)

Start here because every later change needs a repeatable working environment.

- **Database:** Choose SQLite for the portable demo, run all migrations, and add a deterministic demo-order seeder. Keep MySQL as a documented production option.
- **Backend:** Add a setup/readiness command that checks `.env`, database access, migrations, Stripe test configuration, and application health.
- **Frontend:** Add a friendly unavailable/error state if initial authentication or API requests fail. Do not expose Laravel's debug page in a presentation build.
- **Done when:** A clean clone can be installed, seeded, built, started, and opened with one documented sequence.

### 2. Replace hard-coded menu data with the Laravel menu API (Idea 1)

This is the first product change because the current mismatch can create the wrong order.

- **Database:** Add image path, product tag, display order, and optional active fields to menu items. Correct the seeded products and branch identities.
- **Backend:** Return a stable, documented catalog response containing branches, categories, products, prices, images, and availability. Add API tests.
- **Frontend:** Fetch `/api/menu`, render loading/error/empty states, and remove duplicated arrays from Home, Menu, Cart, Staff filters, and Footer.
- **Done when:** A product ID has the same name, price source, branch availability, and image everywhere.

### 3. Add shared branch and fulfillment state (Idea 2)

Once the catalog is trusted, make branch choice consistent across the whole visit.

- **Database:** Add branch opening/service metadata needed by the selector. No cart table is required yet if guest carts remain local.
- **Backend:** Include branch capabilities in the menu/branch response.
- **Frontend:** Add an `OrderContext` that stores selected branch and mode. Connect Navbar, Home quick-add, Menu, Cart, and Footer. Ask before clearing an incompatible cart.
- **Done when:** The selected branch and mode never disagree between the topbar, menu, cart, and submitted payload.

### 4. Make cart contents branch-safe and server-quoted (Idea 6)

This closes the remaining gap between browser display and trusted Laravel totals.

- **Database:** Usually no new table is needed. Add indexes only if quote queries show a need.
- **Backend:** Add a quote endpoint that checks product IDs, options, quantities, branch availability, fees, and trusted totals without creating an order.
- **Frontend:** Store a cart schema version and branch ID, reject mixed-branch lines, debounce quote refresh, and show price/availability changes before checkout.
- **Done when:** The amount shown on the final review exactly matches the amount Laravel will charge or save.

### 5. Correct branch hours, delivery coverage, and pickup time (Idea 8)

Build this before expanding orders because invalid times and addresses create immediate operational pain.

- **Database:** Add weekly branch hours, exceptional closures, Cairo timezone, delivery zones, minimum preparation time, and slot capacity.
- **Backend:** Create an availability/slot endpoint and validate all submitted times and addresses using one explicit timezone.
- **Frontend:** Replace free-form pickup datetime with available slots, show closed/full states, and validate whether an address is in range.
- **Done when:** Customers cannot submit an impossible branch, address, or time.

### 6. Harden payment and retry behavior (Idea 9)

Payments should be improved after totals and fulfillment rules are stable.

- **Database:** Add a payment-attempt table or equivalent fields for lifecycle, retry, failure reason, expiry, and refund references.
- **Backend:** Reuse idempotency keys, verify webhook amount/currency/metadata, expire abandoned orders, and make success/failure/refund transitions explicit and tested.
- **Frontend:** Keep one checkout attempt ID, display processing/pending/succeeded/failed accurately, preserve the cart on uncertain outcomes, and offer safe retry.
- **Done when:** Refreshes, network errors, repeated webhooks, and repeated clicks cannot create duplicate charges or confusing orders.

### 7. Add order confirmation and customer tracking (Idea 4)

Customers need a clear destination after cash or card checkout.

- **Database:** Add a secure guest tracking token and notification/contact preferences if guest tracking is supported.
- **Backend:** Add authorized customer-order endpoints and a token-based guest tracking endpoint that exposes only safe fields.
- **Frontend:** Add success, tracking, history, and reorder pages. Navigate there after checkout instead of leaving a message inside Cart.
- **Done when:** Every customer can see the order number, branch, items, payment state, fulfillment details, and current status after checkout.

### 8. Add the admin catalog and availability workspace (Idea 13)

Finish the top-eight sequence by making the corrected catalog maintainable without code edits.

- **Database:** Add audit fields or a general admin activity log for product, price, availability, and branch changes.
- **Backend:** Add admin-only CRUD endpoints with Form Requests, policies/permissions, uploads, and audit logging.
- **Frontend:** Add focused admin screens for categories, products, branch prices, sold-out controls, images, and hours. Reuse the design system rather than placing these controls in the kitchen board.
- **Done when:** An admin can safely change the live menu and branch availability, and every change has an audit trail.

## 5. Work that should follow the top eight

After the ordering foundation is correct, the best next sequence is:

1. Staff order workspace and conflict-safe actions (Idea 12).
2. True live updates with polling fallback (Idea 11).
3. Reusable design system (Idea 16).
4. Optimized product photography (Idea 17).
5. Full authentication hardening (Idea 20).
6. Historical data protection (Idea 21).
7. Test and CI expansion (Idea 22).
8. Three-minute SLA analytics and customer CRM (Ideas 15 and 14).
9. Final navigation, accessibility, metadata, and presentation polish (Ideas 18, 19, 23, and 25).

## 6. Decision guide

Choose based on the next goal:

- **Need a safe working order flow:** Start with Ideas 24, 1, 2, 6, and 8.
- **Need a strong customer demo:** Add Ideas 9, 4, 17, and 25.
- **Need a convincing CRM demo:** Add Ideas 12, 13, 11, 15, and 14.
- **Need production readiness:** Add Ideas 20, 21, 22, and 23 before launch.

The strongest first choice is **Idea 1: make Laravel's menu API the single source of truth**, after the small demo-environment fix in Idea 24. It removes the most dangerous correctness problem and creates a clean base for nearly every other improvement.
