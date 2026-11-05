# Project Map

This lesson is a map of the whole project.

You do not need to memorize it.

Use it when you feel lost.

## The top level

```text
pizza-crm/
|-- app/
|-- bootstrap/
|-- config/
|-- database/
|-- docs-beginner/
|-- node_modules/
|-- public/
|-- resources/
|-- routes/
|-- storage/
|-- tests/
|-- vendor/
|-- artisan
|-- composer.json
|-- package.json
|-- phpunit.xml
`-- vite.config.js
```

### `app/`

**What it is:** Your main Laravel backend code.

**Why it exists:** Controllers, models, checks, events, and services need a clear home.

**If it disappeared:** The backend could not handle the website's business work.

### `bootstrap/`

**What it is:** Laravel startup files.

**Why it exists:** It tells Laravel which routes, middleware names, and providers to load.

**If it disappeared:** Laravel would not start correctly.

### `config/`

**What it is:** Laravel setting files.

**Why it exists:** Database, sessions, mail, queues, Stripe, and order settings stay organized.

**If it disappeared:** Laravel would lose important instructions and default values.

### `database/`

**What it is:** Database file, table-building migrations, seeders, and factories.

**Why it exists:** Saved data and its setup code belong together.

**If it disappeared:** Local saved users, menu, and orders would be gone.

### `node_modules/`

**What it is:** JavaScript libraries installed by npm.

**Why it exists:** React, Vite, Bootstrap, Stripe, and other packages live here.

**If you delete it:** Your own source remains, but frontend tools stop until you run `npm install` again.

Never edit normal package code here.

### `public/`

**What it is:** Files the browser can request directly.

**Why it exists:** Images, videos, built files, icon, and Laravel's `index.php` must be reachable by the web server.

**If it disappeared:** The site would lose public media and its server entrance.

### `resources/`

**What it is:** Your editable frontend source and Blade view.

**Why it exists:** React, CSS, and HTML source need an organized place before Vite builds them.

**If it disappeared:** The visible application source would be gone.

### `routes/`

**What it is:** Lists of Laravel addresses and their destinations.

**Why it exists:** Laravel needs to know which code handles each request.

**If it disappeared:** Browser requests would not know where to go.

### `storage/`

**What it is:** Runtime files such as logs, caches, sessions, and generated framework files.

**Why it exists:** Laravel needs a writable working area.

**If you delete random files:** You may lose logs or current sessions. Some cache files can be rebuilt, but do not treat the whole folder as disposable.

### `tests/`

**What it is:** Automatic checks for the application.

**Why it exists:** Tests catch broken security, order, and payment behavior.

**If it disappeared:** The website might still run, but you would lose fast proof that important behavior still works.

### `vendor/`

**What it is:** PHP libraries installed by Composer.

**Why it exists:** Laravel, Stripe PHP, PHPUnit, and other backend packages live here.

**If you delete it:** Your source remains, but Laravel stops until you run `composer install` again.

Never edit normal package code here.

## Important top-level files

### `artisan`

Laravel's command tool. Commands such as `php artisan migrate` start here.

### `composer.json` and `composer.lock`

`composer.json` lists wanted PHP packages. The lock file records exact installed versions.

### `package.json` and `package-lock.json`

`package.json` lists JavaScript packages and npm commands. The lock file records exact versions.

### `phpunit.xml`

Settings for automated PHP tests. It uses an in-memory SQLite database so tests do not damage normal data.

### `vite.config.js`

Vite's setup. It says the frontend starts from `resources/css/app.css` and `resources/js/app.jsx`.

### `.env` and `.env.example`

`.env` contains this computer's settings and secrets. `.env.example` is the safe example list. Never publish real secret keys.

## Inside `app/`

```text
app/
|-- Contracts/PaymentGateway.php
|-- Events/OrderPlaced.php
|-- Events/OrderStatusUpdated.php
|-- Http/Controllers/Controller.php
|-- Http/Controllers/Api/AuthController.php
|-- Http/Controllers/Api/MenuController.php
|-- Http/Controllers/Api/OrderController.php
|-- Http/Controllers/Api/PaymentController.php
|-- Http/Controllers/Api/StaffOrderController.php
|-- Http/Middleware/RequireRole.php
|-- Http/Requests/StoreOrderRequest.php
|-- Http/Requests/UpdateOrderStatusRequest.php
|-- Models/Branch.php
|-- Models/Category.php
|-- Models/MenuItem.php
|-- Models/Order.php
|-- Models/OrderItem.php
|-- Models/OrderStatusLog.php
|-- Models/User.php
|-- Providers/AppServiceProvider.php
|-- Services/Orders/OrderCreator.php
`-- Services/Payments/StripePaymentGateway.php
```

- `PaymentGateway.php`: lists the jobs every payment provider must offer.
- `OrderPlaced.php`: announces a new visible order.
- `OrderStatusUpdated.php`: announces a staff status change.
- `Controller.php`: empty shared parent for controllers.
- `AuthController.php`: current user, registration, login, and logout.
- `MenuController.php`: reads branch-aware menu data.
- `OrderController.php`: creates non-card orders.
- `PaymentController.php`: starts Stripe payment and receives Stripe webhooks.
- `StaffOrderController.php`: lists staff orders and changes status.
- `RequireRole.php`: blocks users without staff/admin role.
- `StoreOrderRequest.php`: checks checkout information.
- `UpdateOrderStatusRequest.php`: checks staff status changes.
- `Branch.php`: represents a restaurant branch row.
- `Category.php`: represents a menu category row.
- `MenuItem.php`: represents one menu product row.
- `Order.php`: represents one customer order and its status rules.
- `OrderItem.php`: represents one line inside an order.
- `OrderStatusLog.php`: represents one saved status change.
- `User.php`: represents a customer, staff member, or admin.
- `AppServiceProvider.php`: tells Laravel to use Stripe for PaymentGateway.
- `OrderCreator.php`: safely creates an order and calculates its real total.
- `StripePaymentGateway.php`: talks to Stripe's PHP library.

## Inside `bootstrap/`

- `bootstrap/app.php`: loads web routes and channel routes, names role middleware, and excludes Stripe webhook from browser CSRF checking.
- `bootstrap/providers.php`: loads `AppServiceProvider`.
- `bootstrap/cache/`: generated Laravel startup cache. Do not hand-edit it.

## Inside `config/`

- `app.php`: application name, environment, debug, URL, language, timezone, and encryption key.
- `auth.php`: session login guard, User model, and password reset settings.
- `cache.php`: places Laravel may keep temporary fast copies.
- `database.php`: SQLite default and optional MySQL, MariaDB, PostgreSQL, SQL Server, and Redis settings.
- `filesystems.php`: local, public, and Amazon S3 file storage settings.
- `logging.php`: where messages and errors can be written.
- `mail.php`: ways Laravel can send or record email.
- `orders.php`: minimum pickup preparation time and delivery fee.
- `queue.php`: ways delayed background jobs can run.
- `services.php`: Stripe and other outside-service keys.
- `session.php`: login session storage and cookie safety settings.

These files contain many standard Laravel choices. This project uses only some of them now.

## Inside `database/`

### `database/database.sqlite`

The local SQLite database. It is one binary file, not normal readable source code.

### Migrations

- `0001_01_01_000000_create_users_table.php`: users, password reset tokens, and sessions.
- `0001_01_01_000001_create_cache_table.php`: database cache and locks.
- `0001_01_01_000002_create_jobs_table.php`: queued, batched, and failed jobs.
- `2026_06_14_000001_create_branches_table.php`: branches.
- `2026_06_14_000002_create_categories_table.php`: categories.
- `2026_06_14_000003_create_menu_items_table.php`: products and category link.
- `2026_06_14_000004_create_branch_menu_item_table.php`: branch price and availability.
- `2026_06_14_000005_create_orders_table.php`: first order table.
- `2026_06_14_000006_create_order_items_table.php`: order lines.
- `2026_09_28_000001_add_commerce_fields.php`: roles, customer details, pickup, payment, notes, and new statuses.
- `2026_09_28_000002_create_order_status_logs_table.php`: order history.

### Seeders and factory

- `DatabaseSeeder.php`: runs the other seeders.
- `MenuCatalogSeeder.php`: adds branches, categories, products, prices, and availability.
- `StaffUserSeeder.php`: creates the first staff login.
- `UserFactory.php`: makes fake users for tests.
- `database/.gitignore`: keeps the directory in source control while ignoring unwanted generated database files.

## Inside `routes/`

- `web.php`: all website and API routes. They are here because this same website uses browser sessions and CSRF protection.
- `channels.php`: decides who may listen to the private staff order broadcast channel.
- `console.php`: defines the sample `inspire` terminal command.

There is no `routes/api.php` in this project. That is intentional in the current code.

## Inside `resources/js/`

### Startup and shared tools

- `app.jsx`: active React starting file, routes, global Navbar/Footer, and hero-ready state.
- `app.js`: older one-line entry that imports `bootstrap.js`; Vite does not use it as the current entry.
- `bootstrap.js`: adds `app-ready` after HTML loads. It is not the Bootstrap CSS library.
- `lib/api.js`: safe JSON request helper with session cookie and CSRF headers.
- `context/AuthContext.jsx`: shared current-user state and login/register/logout functions.

### Components

- `BrandLogo.jsx`: reusable logo link. It is currently not used by Navbar, which writes its own logo markup.
- `CartDrawer.jsx`: older off-canvas cart. It is not mounted by the current app.
- `Footer.jsx`: contact locations, email, social placeholders, and copyright.
- `Navbar.jsx`: desktop/mobile navigation, cart count, order toggle, login/account menu, and reveal animation.

### Pages

- `Pages/Auth/Login.jsx`: login form and staff/customer redirect.
- `Pages/Auth/Register.jsx`: customer registration form.
- `Pages/Cart.jsx`: active cart and checkout page.
- `Pages/HeroLanding.jsx`: older image-based hero experiment. Not active.
- `Pages/HeroSlider.jsx`: older rotating pizza hero. Not active.
- `Pages/Home.jsx`: active homepage, video hero, awards, featured pizzas, about, and contact.
- `Pages/MenuPage.jsx`: active branch picker and hard-coded menu cards.
- `Pages/SpecialsSection.jsx`: older special cards. Not active.
- `Pages/StaffDashboard.jsx`: staff order screen and polling notifications.

## Inside `resources/css/`

- `app.css`: global colors, scrollbar, cards, menu, footer, auth, cart drawer, and responsive rules.
- `hero-slider.css`: styles for the older unused HeroSlider page.

Large active components also contain CSS inside `<style>` blocks.

## Inside `resources/views/`

- `app.blade.php`: active HTML shell for React.
- `welcome.blade.php`: Laravel's older welcome view. The current catch-all uses `app.blade.php` instead.

## Inside `public/`

- `index.php`: the web server entrance into Laravel.
- `build/`: generated Vite production CSS/JavaScript and manifest.
- `images/`: logo and pizza images.
- `videos/hero-pizza-motion.mp4`: active homepage video.
- `videos/hero-pizza-ending-loop.mp4`: old unused loop asset.
- `favicon.ico`: browser tab icon.
- `robots.txt`: simple search-engine instructions.
- `hot`: generated marker telling Laravel that a Vite development server is active.

## Inside `tests/`

- `TestCase.php`: shared parent for Laravel tests.
- `Feature/ExampleTest.php`: checks the application responds successfully.
- `Feature/OrderOperationsTest.php`: checks staff protection, status logs, pickup notes, and payment webhook safety.
- `Unit/ExampleTest.php`: tiny example checking that true is true.

## What you should remember

- Edit your code mainly in `app/`, `resources/`, `routes/`, `database/`, and `config/`.
- Do not hand-edit `vendor/`, `node_modules/`, `bootstrap/cache/`, or built files.
- `public/` holds files the browser can request directly.
- `database.sqlite` is the local saved-data file.
- Some files are old experiments and are not imported by the active application.

## Test yourself

1. Where is the main backend code?
2. Where is the main React code?
3. What is the difference between `vendor` and `node_modules`?
4. Which file stores local database data?
5. Which React file starts the current application?

## Answers

1. It is mainly in `app/`.
2. It is mainly in `resources/js/`.
3. `vendor` has PHP libraries. `node_modules` has JavaScript libraries.
4. `database/database.sqlite`.
5. `resources/js/app.jsx`.
