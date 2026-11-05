# Simple Interview Questions and Answers

These answers are short enough to say out loud.

Do not memorize every word.

Understand the idea and say it naturally.

## Project basics

### 1. What is this project?

It is a pizza ordering website with a customer side and a staff order dashboard. React runs the screen. Laravel checks and saves orders.

### 2. Who uses it?

Customers browse, build a cart, choose delivery or pickup, and pay. Staff manage valid orders through kitchen statuses.

### 3. What is the frontend?

The frontend is what users see in the browser. This project uses React, CSS, Bootstrap, and Framer Motion.

### 4. What is the backend?

The backend is hidden server code. Laravel validates data, checks roles, calculates prices, talks to Stripe, and uses the database.

### 5. Which database does it use?

It uses SQLite locally. The data is stored in one file called `database/database.sqlite`.

### 6. Why SQLite?

It is simple for learning and local development. I do not need to install a separate database server.

### 7. What is an SPA?

It means Single-Page Application. React changes pages without downloading a completely new HTML page each time.

### 8. What does Vite do?

It runs the frontend during development and builds optimized browser files for production.

## React questions

### 9. What is a React component?

It is a reusable screen function. Examples are Navbar, Footer, Cart, and StaffDashboard.

### 10. What is state?

State is information a component remembers and can change. Cart state includes items, branch, fulfillment, and customer fields.

### 11. What are props?

Props are values a parent component gives to a child. AppShell gives `heroReady` and `onHeroReady` to Home.

### 12. What does `useEffect` do?

It runs work outside normal screen drawing. This project uses it for video playback, timers, polling, and browser event listeners.

### 13. What is Context used for?

AuthContext shares the logged-in user and login/logout actions with many components.

### 14. Why not use Redux?

The shared auth state is small. Context is enough. A larger application could choose a dedicated store later.

### 15. How does React routing work?

BrowserRouter and Route map addresses such as `/menu` and `/cart` to components. Link changes pages without a full reload.

### 16. Where is the cart stored?

It is stored as JSON in browser localStorage under `wtc_cart`.

### 17. Is localStorage trusted?

No. A user can edit it. Laravel looks up real database prices before saving or charging.

## Laravel and database questions

### 18. What is a route?

A route connects an HTTP address and method to controller code. For example POST `/api/orders` goes to OrderController store.

### 19. Why are API routes in `web.php`?

React and Laravel use the same website origin. `web.php` gives the API normal session and CSRF middleware.

### 20. What is a controller?

A controller receives the request and coordinates the response. It calls validation, services, models, or events.

### 21. What is a Form Request?

It is a Laravel class that validates submitted information before the controller uses it.

### 22. What is a model?

A model is a PHP class representing a database table. Order represents rows in the orders table.

### 23. What is Eloquent?

It is Laravel's ORM. It lets me read and change database records using PHP models and relationships.

### 24. What is a migration?

It is a repeatable database table change. It can create a table, add columns, or remove them during rollback.

### 25. What is a seeder?

It adds starting or demo data. MenuCatalogSeeder creates branches, categories, products, prices, and availability.

### 26. What is a pivot table?

It connects two tables. `branch_menu_item` connects branches and products and stores branch-specific price and availability.

### 27. Why use a transaction for order creation?

The order and all its items must save together. If one step fails, the whole group is undone.

### 28. Why save price on OrderItem?

It keeps the historical price. A future menu price change does not change an old order.

### 29. What is an N+1 query problem?

It means one starting query plus another query for every item. OrderCreator currently checks one branch pivot per cart line and could batch them later.

## Login and security questions

### 30. How does login work?

React sends email/password with CSRF. Laravel verifies them, regenerates the session, and returns the user. AuthContext updates the UI immediately.

### 31. Does the project use Sanctum?

No. It uses Laravel's normal session-based `web` guard.

### 32. What is a session?

Laravel keeps login information on the server and connects it to a protected browser cookie.

### 33. What is CSRF protection?

It stops another website from secretly sending changing requests through a logged-in browser. React sends Laravel's CSRF token.

### 34. Authentication versus authorization?

Authentication checks who the person is. Authorization checks what that person may do.

### 35. How are staff routes protected?

Laravel requires both `auth` and `role:staff,admin` middleware. React also hides the screen, but backend middleware is the real security.

### 36. Why regenerate the session after login?

It prevents session fixation by replacing the old session ID.

## Order questions

### 37. How is an order created?

Cart sends item IDs, quantity, notes, customer, branch, and fulfillment. Laravel validates, checks availability, calculates database prices, saves order/items in a transaction, and returns JSON.

### 38. Why does Laravel calculate the total?

Browser values can be edited. Only server database prices and configured fee are trusted.

### 39. How is pickup time checked?

React gives a minimum hint. Laravel uses the configured preparation minutes and rejects an earlier time.

### 40. Are branch opening hours checked?

The request contains optional code for them, but current Branch table does not have opening and closing columns, so that check does not run.

### 41. How do kitchen notes work?

React saves up to 200 characters per cart item. Laravel validates and saves notes on order_items. Staff dashboard displays them.

### 42. What is the order status flow?

New goes to accepted, preparing, and ready. Delivery then goes out for delivery and completed. Pickup goes picked up and completed. Some steps allow cancel/reject with reason.

### 43. Why keep status logs?

They record old status, new status, staff actor, reason, and time for an audit history.

## Payment questions

### 44. How are card details protected?

Stripe's hosted CardElement receives them directly. Laravel never stores raw card numbers or CVC.

### 45. What is a PaymentIntent?

It is Stripe's record for one payment attempt from creation to success or failure.

### 46. Why use a webhook?

Browser success is not final proof. Stripe sends a signed server message that Laravel verifies before marking paid.

### 47. What is idempotency?

It prevents duplicate work when the same payment request or webhook is repeated.

### 48. When do staff see card orders?

Only after the verified success webhook changes the order from payment_pending to paid and new.

### 49. Why use a PaymentGateway interface?

Controllers depend on general payment jobs instead of Stripe details. Tests can replace it with a fake.

## Staff and notifications

### 50. Is the staff dashboard real-time?

It is near-live using seven-second polling. Backend broadcast events exist, but React Echo/Reverb is not connected.

### 51. How are new orders detected?

The dashboard compares returned new-order IDs with the IDs from the previous poll.

### 52. Why is notification sound behind a button?

Browsers block sound before a user action. Staff click to create/resume AudioContext.

### 53. Who decides legal status changes?

Laravel does. React only shows helpful buttons. StaffOrderController checks Order transition rules again.

## Hero and design

### 54. How does the hero video behave?

It resets and plays once on each page load. During its final two media seconds, speed smoothly lowers toward 0.28x. Then it stays on the last frame.

### 55. When do Navbar and hero text appear?

They appear when slow motion starts, around when the pizza reaches the center.

### 56. What happens if autoplay fails?

The page reveals Navbar and text immediately so navigation is never trapped.

### 57. How is reduced motion handled?

The navigation and hero entrance animations can start directly without movement. The video still plays; skipping it would be a possible future accessibility improvement.

## Honest questions about weaknesses

### 58. What is the biggest current data weakness?

MenuPage hard-codes menu data even though Laravel has a menu API and database. I would connect React to `/api/menu` so there is one source of truth.

### 59. What old code remains?

HeroLanding, HeroSlider, SpecialsSection, CartDrawer, app.js, welcome.blade.php, and an old ending-loop video are not active.

### 60. What would you improve next?

I would connect menu API, keep branch choice consistent with Cart, add branch hours, improve payment tests/failure recovery, prevent overlapping polls, and organize large inline CSS/components.

### 61. Did you build everything without help?

An honest answer: “I used AI assistance while developing and documenting it. I am now studying the real code line by line and rebuilding small parts myself. I can explain the data flow and current weaknesses honestly.”

## A short project introduction you can say

“What The Crust is a React and Laravel pizza ordering application. Customers select a branch, build a cart, choose delivery or pickup, add notes, and pay by cash or Stripe. Laravel validates everything, recalculates trusted prices, and saves orders in SQLite. Staff use a role-protected dashboard with polling notifications and controlled status transitions. Stripe card orders reach staff only after a verified webhook confirms payment.”

## Simple live demo order

1. Refresh Home and show video slowdown plus content reveal.
2. Open Menu and select a branch.
3. Add two items and show Navbar cart count.
4. Open Cart, change quantity, add notes, and show delivery/pickup fields.
5. Submit a cash order for a reliable demo.
6. Log in as staff and open dashboard.
7. Show the order and move it through allowed statuses.
8. Explain that card demo needs Stripe test keys and webhook forwarding.

## What you should remember

- Keep answers short, true, and connected to a real file or flow.
- Say session auth, not Sanctum.
- Say polling, not active WebSockets.
- Admit duplicated menu data and old inactive files.
- Explain security using server validation, role middleware, trusted prices, and signed webhooks.

## Test yourself

1. What are the three main parts of the project?
2. What should you say about Sanctum?
3. What should you say about real-time updates?
4. What is the safest payment point to explain?
5. What is one honest next improvement?

## Answers

1. React frontend, Laravel backend, and SQLite database.
2. It is not installed; the project uses normal Laravel sessions.
3. The dashboard currently polls every seven seconds; broadcast events are prepared.
4. Raw card data goes directly to Stripe, and Laravel marks paid only after a verified webhook.
5. Connect MenuPage to `/api/menu` so the database is the single source of truth.
