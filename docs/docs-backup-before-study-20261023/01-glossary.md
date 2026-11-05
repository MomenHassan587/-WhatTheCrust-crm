# Beginner Glossary

This is your coding dictionary.

The words are in alphabetical order.

Each meaning is short.

The pizza example helps you remember it.

## A

**API** - A set of server addresses used by programs. It is like the service window between the dining room and kitchen.

**Argument** - A value given to a function. It is like telling the cook which pizza size to make.

**Array** - A list of values. It is like a list of pizzas on one order ticket.

**Asset** - A file used by the website, such as an image, video, CSS file, or JavaScript file.

**Async** - Work that can wait for another task, such as waiting for Laravel to answer without freezing the whole page.

**Authentication** - Checking who a person is. It is like staff showing an ID card before entering the kitchen.

**Authorization** - Checking what an identified person may do. A customer and a manager have different permissions.

**Autoplay** - A video or sound starts by itself.

## B

**Backend** - Hidden server code that checks requests and works with the database. It is the kitchen.

**Blade** - Laravel's HTML page tool. It creates the first page sent to the browser.

**Bootstrap design library** - Ready-made CSS and React screen parts for grids, forms, cards, and menus.

**`bootstrap.js`** - This project's small JavaScript startup file. It is not the Bootstrap design library.

**Broadcast** - A server message sent to listening screens. It is like the kitchen calling out, “New order!”

**Browser** - The program that opens a website, such as Chrome or Edge.

**Build** - The step where Vite checks and prepares frontend files for a browser.

## C

**Cache** - A saved copy used to make later work faster. It is like keeping popular ingredients close to the oven.

**Callback** - A function given to other code to run later, such as after a button click.

**Class (CSS)** - A reusable style name, such as `.btn-red`.

**Class (PHP)** - A plan for making objects with data and actions, such as the `Order` model.

**Client** - A program asking a server for work. In this project, the browser is the client.

**Column** - One named type of database information, such as `status` or `total_price`.

**Component** - A reusable React screen piece, such as Navbar or Footer.

**Composer** - The tool that installs PHP libraries listed in `composer.json`.

**Config** - Settings used by the application, such as delivery fee or database type.

**Constant** - A named value that should not change, such as `STATUS_NEW`.

**Context** - React's way to share information with many components. AuthContext shares the logged-in user.

**Controller** - Laravel code that receives a request and decides what work should happen. It is like a waiter sending a ticket to the correct station.

**Cookie** - A small value the server asks the browser to keep. The login session cookie is like a stamped customer wristband.

**CRUD** - Create, Read, Update, Delete. These are four common jobs for saved data.

**CSRF** - Protection against another site secretly sending a request through your logged-in browser. It is like a secret stamp on a real order ticket.

**CSS** - Code that controls color, size, space, and layout. It is the restaurant designer.

## D

**Database** - Organized saved information. It is the restaurant record book.

**Dependency** - A library the project needs, such as React or Stripe.

**Deploy** - Put the website on a real server so other people can use it.

**DOM** - The browser's live tree of HTML items. JavaScript can read and change it.

## E

**Eloquent** - Laravel's tool for reading and changing database rows using PHP models.

**Endpoint** - One API address, such as `POST /api/orders`.

**Environment variable** - A setting kept outside normal code, often in `.env`, such as a secret Stripe key.

**Event (browser)** - Something that happens, such as a click or video ending.

**Event (Laravel)** - A message inside the backend saying something happened, such as `OrderPlaced`.

**Exception** - A problem that interrupts normal code. Code can catch it and show a safer message.

## F

**Factory** - Test code that makes fake database records, such as fake users.

**Field** - One input or saved value, such as phone number.

**Fillable** - A model list saying which fields may be filled using an array.

**Foreign key** - A database value that points to a row in another table. `orders.branch_id` points to a branch.

**Form Request** - A Laravel class that checks submitted information before a controller uses it.

**Framework** - A large set of tools and rules for building software. Laravel is a PHP framework.

**Frontend** - The visible and clickable browser part. It is the restaurant dining room.

**Function** - A named group of instructions that performs one job.

## G

**GET** - An HTTP method that normally asks the server for information.

**Git** - A tool that remembers code changes. It is like version history for the project.

**Guard** - Laravel's chosen login system. This project uses the session-based `web` guard.

## H

**Hash** - A one-way protected version of a password. The original password is not stored.

**Hook** - A React function beginning with `use`, such as `useState` or `useEffect`.

**HTML** - Code that gives a page its structure. It is the walls and tables of the restaurant.

**HTTP** - The rules browsers and servers use to exchange requests and responses.

**HTTP method** - A request action word, such as GET, POST, or PATCH.

**HTTP status code** - A number explaining the result. `200` means success, `401` means not logged in, and `422` means submitted information is wrong.

## I

**ID** - A unique number or name used to identify one item.

**Idempotency key** - A unique request label that stops one card payment from being created twice.

**Import** - Bring code from another file or library into the current file.

**Index (database)** - Extra database information that makes searching a column faster.

**Interface (PHP)** - A promise listing jobs that a class must provide. `PaymentGateway` says every payment provider must create an intent and read a webhook.

## J

**JavaScript** - The main programming language used by the browser.

**JSON** - A text format for sending organized information between React and Laravel.

**JSX** - HTML-like screen code written inside JavaScript for React.

## K

**Key (React list)** - A stable ID that helps React recognize each displayed item.

## L

**Laravel** - The PHP framework used by the backend.

**Library** - Ready-made code for a job. React and Framer Motion are libraries.

**Listener** - Code waiting for an event, such as a click or storage change.

**Local storage** - Browser storage used here for the cart. It is a note at the customer's table, not trusted kitchen data.

**Log** - A written record of what the application did or what error happened.

## M

**Middleware** - A check that runs before a controller. It is like security at the kitchen door.

**Migration** - A PHP file that creates or changes database tables in a repeatable way.

**Model** - A PHP class representing a database table, such as Order or User.

**Module** - A JavaScript file that can import and export code.

## N

**Namespace** - A full PHP address that prevents classes with the same short name from colliding.

**Node.js** - The program that runs frontend tools such as npm and Vite outside the browser.

**node_modules** - The generated folder containing installed JavaScript libraries.

**npm** - The tool that installs JavaScript libraries from `package.json`.

**Nullable** - A database field is allowed to be empty.

## O

**Object (JavaScript)** - A group of named values, such as `{ name: 'Mona', phone: '010...' }`.

**Object (PHP)** - One created instance of a class, such as one Order model.

**ORM** - Object-Relational Mapper. It connects programming objects to database rows. Eloquent is Laravel's ORM.

## P

**Package** - Another name for an installed library.

**PATCH** - An HTTP method used to change part of an existing record, such as order status.

**PaymentIntent** - A Stripe record that follows one attempted payment from creation to success or failure.

**PHP** - The programming language used by Laravel on the server.

**Pivot table** - A table connecting two other tables. `branch_menu_item` connects branches and menu items and holds price.

**Polling** - Asking the server for new information every few seconds. The staff dashboard polls every seven seconds.

**POST** - An HTTP method normally used to send new information to the server.

**Provider (Laravel)** - A startup class that teaches Laravel about a service. AppServiceProvider connects PaymentGateway to Stripe.

**Props** - Values a parent React component gives to a child component.

**Protected route** - A page or endpoint allowed only for certain users.

## Q

**Query** - A request to read or change database information.

**Queue** - A waiting line for backend jobs that can run later.

## R

**React** - A JavaScript library for building browser screens from components.

**React Router** - The library that shows different React pages for addresses such as `/menu` and `/cart`.

**Ref** - A React box that keeps a value or points to a screen item without causing a redraw.

**Relationship** - A connection between database records, such as one Order having many OrderItems.

**Request** - A message from the browser to the server.

**Response** - The server's answer to a request.

**REST API** - A common way to organize API addresses around things and HTTP methods.

**Role** - A user's permission group, such as customer, staff, or admin.

**Route** - A rule connecting an address and HTTP method to code that handles it.

**Row** - One saved database record, such as one order.

## S

**Sanctum** - A Laravel authentication package. It is not installed in this project.

**Seeder** - Code that fills the database with starting or example information.

**Server** - A computer/program that receives requests and sends responses.

**Service class** - Backend code focused on one business job, such as creating an order.

**Session** - Server-kept login information connected to a browser cookie.

**SPA** - Single-Page Application. React changes screens without reloading the whole HTML page.

**SQLite** - A database stored in one file. This project uses `database/database.sqlite` locally.

**State** - Information a React component remembers and can change, causing the screen to update.

**Status** - A word describing a record's current step, such as `new` or `preparing`.

**Stripe** - The outside payment company used for card payments.

## T

**Table** - A database list made from columns and rows.

**Test** - Code that automatically checks whether other code behaves correctly.

**Token** - A hard-to-guess value used as proof. The project uses a CSRF token, but not login bearer tokens.

**Transaction** - A database group that succeeds completely or is completely undone.

## U

**UI** - User Interface. Everything the user sees and interacts with.

**URL** - The address of a page or API endpoint.

**useEffect** - A React hook for work outside drawing the screen, such as starting a timer or video.

**useMemo** - A React hook that remembers a calculated result until its inputs change.

**useRef** - A React hook that keeps a value or DOM element between redraws.

**useState** - A React hook that gives a component changeable memory.

## V

**Validation** - Checking that submitted information is present and allowed.

**Variable** - A named place that holds a value.

**vendor** - The generated folder containing Composer's installed PHP libraries.

**Vite** - The tool that runs and builds the frontend code.

## W

**Webhook** - A server-to-server message. Stripe sends one to Laravel after a payment changes.

**WebSocket** - A long-lived connection for immediate messages. This project prepares broadcast events but currently uses polling in the browser.

## What you should remember

- Use this file whenever a lesson contains an unfamiliar word.
- Frontend words usually describe what happens in the browser.
- Backend words usually describe Laravel, security, or saved data.
- A request goes to a route, passes checks, reaches code, and gets a response.
- Installed does not always mean used. Sanctum and WebSockets are examples here.

## Test yourself

1. What is the difference between authentication and authorization?
2. What does a migration do?
3. What is local storage used for here?
4. What does polling mean?
5. What is a webhook?

## Answers

1. Authentication checks who the person is. Authorization checks what that person may do.
2. A migration creates or changes database tables in a repeatable way.
3. It keeps the cart in the browser between pages and refreshes.
4. It means asking the server for updates every few seconds.
5. It is a server-to-server message. Stripe uses one to tell Laravel about payment results.
