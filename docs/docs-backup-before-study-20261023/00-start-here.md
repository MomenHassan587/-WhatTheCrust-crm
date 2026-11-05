# Start Here: How This Website Works

This is your first lesson.

You do not need to know any code yet.

We will use a pizza restaurant as our example.

Your project is called **What The Crust**.

It is a website for pizza customers and restaurant staff.

---

## 1. What is a website?

A website is a group of pages that a person opens in a web browser.

A **web browser** is a program such as Chrome, Edge, or Firefox.

Think of the browser as the customer's table in a pizza restaurant.

The customer can:

- read the menu;
- press buttons;
- add pizza to a cart;
- enter a name and phone number;
- send an order.

The browser shows the website.

But the browser does not do all the work.

Your project has three main parts:

1. The frontend.
2. The backend.
3. The database.

---

## 2. The frontend

The **frontend** is the part that the customer can see and touch.

It includes:

- words;
- pictures;
- videos;
- buttons;
- forms;
- colors;
- movement and animation.

Think of the frontend as the restaurant dining room.

It contains the printed menu, tables, lights, signs, and order buttons.

In this project, most frontend code is inside:

```text
resources/js/
resources/css/
resources/views/
```

The frontend uses HTML, CSS, JavaScript, and React.

We will explain each one soon.

---

## 3. The backend

The **backend** is the hidden part that works on the server.

A **server** is a computer that receives requests and sends answers.

Think of the backend as the restaurant kitchen.

The customer cannot walk into the kitchen and change an order price.

The kitchen checks the order.

It asks questions like:

- Does this branch exist?
- Is this pizza available?
- Is the quantity allowed?
- Is the pickup time valid?
- Has the card payment really succeeded?
- Is this person allowed to use the staff screen?

In this project, the backend is mainly inside:

```text
app/
routes/
config/
bootstrap/
```

The backend uses PHP and Laravel.

---

## 4. The database

A **database** is an organized place for saved information.

Think of it as the restaurant's record book.

The record book can save:

- users;
- branches;
- menu items;
- prices;
- orders;
- order items;
- payment status;
- order status history.

Your local project uses **SQLite**.

SQLite is a small database stored in one file.

That file is:

```text
database/database.sqlite
```

This is useful while learning.

You do not need to install a separate database program.

Later, a large live website might use MySQL or PostgreSQL.

For now, imagine `database.sqlite` as one strong digital notebook.

Do not open it in a text editor and type into it.

Laravel reads and writes it safely.

---

## 5. What is HTML?

**HTML** means HyperText Markup Language.

The long name is not important yet.

HTML gives a web page its basic structure.

Think of HTML as the walls, doors, tables, and menu boards in the restaurant.

Here is real HTML from your project:

```html
<body>
    <div id="root"></div>
</body>
```

This code is in `resources/views/app.blade.php`.

**Blade** is Laravel's tool for creating HTML pages.

A Blade file can contain normal HTML and small Laravel instructions.

### Line: `<body>`

**What it says:** Start the visible part of the web page.

**Why it is there:** The browser needs a place for visible content.

**If you delete it:** The page structure becomes invalid. The browser may try to repair it, but the page is no longer written correctly.

### Line: `<div id="root"></div>`

**What it says:** Make an empty box called `root`.

A `div` is a simple HTML box.

An `id` is a unique name for one HTML item.

**Why it is there:** React finds this box and puts the whole application inside it.

Think of this box as the empty restaurant building before the furniture arrives.

**If you delete it:** React cannot find `root`. The website will not appear.

### Line: `</body>`

**What it says:** The visible page ends here.

**Why it is there:** It closes the `<body>` started above.

**If you delete it:** Browsers may guess where the body ends, but the HTML is incomplete.

---

## 6. What is CSS?

**CSS** means Cascading Style Sheets.

CSS controls how the page looks.

Think of CSS as the restaurant designer.

CSS chooses:

- colors;
- sizes;
- spaces;
- fonts;
- positions;
- mobile layouts.

Here is real CSS from `resources/css/app.css`:

```css
body {
    margin: 0;
    background: var(--bg-primary);
    color: var(--text-main);
}
```

### Line: `body {`

**What it says:** The following design rules belong to the HTML body.

**Why it is there:** It lets one group of rules style the whole visible page.

**If you delete it:** The rules below are no longer connected correctly to the body.

### Line: `margin: 0;`

**What it says:** Remove the browser's normal empty space around the page.

**Why it is there:** The design can reach the screen edges cleanly.

**If you delete it:** A small unwanted white or dark gap may appear around the page.

### Line: `background: var(--bg-primary);`

**What it says:** Use the project's main background color.

`var(...)` means “use a saved CSS value.”

**Why it is there:** The site gets its dark background.

**If you delete it:** The browser's normal background may show instead.

### Line: `color: var(--text-main);`

**What it says:** Use the project's main text color.

**Why it is there:** Text stays bright and readable on the dark background.

**If you delete it:** Some text may become dark and difficult to read.

### Line: `}`

**What it says:** The body design rules end here.

**Why it is there:** CSS needs to know where this group ends.

**If you delete it:** Rules below may be read incorrectly.

---

## 7. What is JavaScript?

**JavaScript** is a programming language used by the browser.

A programming language is a way to give exact instructions to a computer.

JavaScript makes the page react to the customer.

Think of JavaScript as the restaurant worker who responds when someone presses a button.

JavaScript can:

- open the mobile menu;
- add a pizza to the cart;
- change a quantity;
- play the hero video;
- send an order to Laravel;
- show a success message.

Here is real JavaScript from `resources/js/bootstrap.js`:

```js
window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('app-ready');
});
```

### Line: `window.addEventListener('DOMContentLoaded', () => {`

**What it says:** Wait until the browser has built the page. Then run the code inside.

An **event** is something that happens. A button click is an event. Page loading is also an event.

**Why it is there:** The code should not touch the page body before the body exists.

**If you delete it:** The ready class will not be added at the correct time.

### Line: `document.body.classList.add('app-ready');`

**What it says:** Add the CSS class `app-ready` to the page body.

A **class** is a reusable name that CSS can style.

**Why it is there:** `app.css` has design rules for `.app-ready`.

**If you delete it:** The normal app background decoration will not turn on.

### Line: `});`

**What it says:** Finish the instructions that run after the page loads.

**Why it is there:** The opening line must be closed.

**If you delete it:** JavaScript will have a writing error. The file will not run.

Important: this file is named `bootstrap.js` because it helps start the application.

It is **not** the Bootstrap design library.

Your project also uses the Bootstrap design library. That is a separate package.

We will study this difference later.

---

## 8. What is React?

**React** is a JavaScript library for building screens.

A **library** is ready-made code that helps us do a job.

Think of React as a restaurant system made from reusable stations.

One station is the navbar.

One station is the menu.

One station is the cart.

One station is the staff dashboard.

React calls these pieces **components**.

A component is a reusable part of the screen.

Here is real code from `resources/js/app.jsx`:

```jsx
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import MenuPage from './Pages/MenuPage';
import Cart from './Pages/Cart';
```

`JSX` is a way to write HTML-like screen code inside JavaScript.

### First two lines

**What they say:** Bring the Navbar and Footer components into this file.

`import` means “bring code from another file so I can use it here.”

**Why they are there:** The application needs the top navigation and bottom contact area.

**If you delete them:** The later `<Navbar />` or `<Footer />` lines will not know what those names mean. The build will fail.

### Next three lines

**What they say:** Bring in the Home, Menu, and Cart pages.

**Why they are there:** The website needs different screens for these jobs.

**If you delete one:** That page cannot be used by the main application file.

When we say the project will **build**, we mean Vite checks and prepares the frontend files so a browser can run them.

Now look at this real block:

```jsx
<Routes>
    <Route path="/" element={<Home />} />
    <Route path="/menu" element={<MenuPage />} />
    <Route path="/cart" element={<Cart />} />
</Routes>
```

A **route** is a rule that connects a web address to a page.

Think of a route as a sign in the restaurant:

- `/` points to the front door;
- `/menu` points to the menu counter;
- `/cart` points to checkout.

### Line: `<Routes>`

**What it says:** Start the list of frontend address rules.

**Why it is there:** React must choose one page for the current address.

**If you delete it:** The Route items lose their required parent. Routing breaks.

### Line with `path="/"`

**What it says:** At the main address, show the Home component.

**Why it is there:** Customers need a homepage.

**If you delete it:** Opening the main website address will not show Home through React Router.

### Line with `path="/menu"`

**What it says:** At `/menu`, show MenuPage.

**Why it is there:** The Menu button needs a destination.

**If you delete it:** `/menu` will have no matching React page.

### Line with `path="/cart"`

**What it says:** At `/cart`, show Cart.

**Why it is there:** Customers need a checkout screen.

**If you delete it:** The cart link cannot open the Cart page.

### Line: `</Routes>`

**What it says:** The list of address rules ends here.

**Why it is there:** It closes the Routes block.

**If you delete it:** JSX becomes invalid and the project will not build.

---

## 9. How React enters the HTML page

Here is the bottom of `resources/js/app.jsx`:

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

### First line

**What it says:** Find the HTML box named `root`. Prepare React to control it.

**Why it is there:** This connects React to `<div id="root"></div>` in the Blade file.

**If you delete it:** React never enters the page. The page stays empty.

### Line: `<React.StrictMode>`

**What it says:** In development, ask React to check for some unsafe mistakes.

**Why it is there:** It helps developers notice problems earlier.

**If you delete it:** The app can still run, but React gives fewer development warnings.

### Line: `<App />`

**What it says:** Show the main App component.

**Why it is there:** App contains the website's pages and shared parts.

**If you delete it:** React has nothing useful to show.

### Final lines

**What they say:** Close StrictMode and finish the render instruction.

**Why they are there:** Every opened block and function call must close.

**If you delete them:** The JavaScript is incomplete and will fail to build.

---

## 10. What is PHP?

**PHP** is the programming language used by your backend.

JavaScript mainly works in the customer's browser.

PHP works on the server.

Think of PHP as the language spoken by the kitchen workers.

PHP receives an order, checks it, saves it, and sends an answer.

PHP files usually end with `.php`.

Examples from your project are:

```text
routes/web.php
app/Http/Controllers/Api/OrderController.php
app/Models/Order.php
```

---

## 11. What is Laravel?

**Laravel** is a PHP framework.

A **framework** is a large set of tools and rules for building an application.

Think of Laravel as the restaurant's complete kitchen system.

It gives you places for:

- address rules;
- order checking;
- login;
- database work;
- sending answers;
- testing.

Laravel saves you from building every basic tool yourself.

---

## 12. What is an API?

**API** means Application Programming Interface.

That name sounds difficult.

For now, think of an API as the restaurant service window.

The frontend gives an order ticket to the window.

The backend kitchen reads the ticket.

The kitchen sends an answer back through the same window.

An API has agreed addresses and data shapes.

Here is a real API route from `routes/web.php`:

```php
Route::post('/orders', [OrderController::class, 'store']);
```

### Part: `Route::post`

**What it says:** Accept information sent to this address.

`POST` is an HTTP method.

An **HTTP method** tells the server what kind of action the browser wants.

`GET` usually asks for information.

`POST` usually sends new information.

**Why it is there:** A customer needs a way to send a new order.

**If you delete it:** Laravel will not accept new orders at this address.

### Part: `'/orders'`

**What it says:** This rule belongs to the `/orders` address.

The surrounding route group adds `/api`, so the full address is `/api/orders`.

**Why it is there:** The frontend needs a known service-window address.

**If you change it without changing React:** React will send orders to the old address and receive a “not found” error.

### Part: `[OrderController::class, 'store']`

**What it says:** Give the request to the `store` job inside OrderController.

A **controller** is backend code that receives a request and chooses what happens next.

Think of the controller as the waiter who takes the ticket to the correct kitchen station.

**Why it is there:** Laravel must know which code should handle the order.

**If you delete it:** The route has no order-handling destination.

---

## 13. What is JSON?

**JSON** means JavaScript Object Notation.

JSON is a simple text format for sending organized information.

Think of JSON as the standard order-ticket layout used by the dining room and kitchen.

An order can look like this:

```json
{
    "branch_id": 1,
    "order_type": "delivery",
    "customer_name": "Mona",
    "items": [
        {
            "menu_item_id": 2,
            "quantity": 1
        }
    ]
}
```

### First and last braces: `{` and `}`

**What they say:** This is one group of related information.

**Why they are there:** JSON needs a clear start and end.

**If you delete one:** The JSON is broken. Laravel cannot read it correctly.

### Line: `"branch_id": 1`

**What it says:** The customer selected branch number 1.

**Why it is there:** Different branches can have different prices and availability.

**If you delete it:** Laravel validation will reject the order because branch is required.

### Line: `"order_type": "delivery"`

**What it says:** The customer wants delivery.

**Why it is there:** Laravel needs to know whether to require an address or pickup time.

**If you delete it:** Laravel will reject the order.

### Line: `"customer_name": "Mona"`

**What it says:** The customer's name is Mona.

**Why it is there:** Staff need to identify the customer.

**If you delete it:** Laravel will reject the order because a name is required.

### Block: `"items": [...]`

**What it says:** Here is a list of ordered items.

Square brackets `[` and `]` mean a list.

**Why it is there:** An order must contain at least one item.

**If you delete it:** There is no pizza order to create. Laravel rejects it.

---

## 14. How the browser sends a real order

Here is real code from `resources/js/Pages/Cart.jsx`:

```jsx
const response = await csrfFetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(buildPayload()),
});
```

### Part: `const response =`

**What it says:** Save the backend's answer under the name `response`.

`const` creates a name whose value will not be replaced in this small block.

**Why it is there:** The next line needs the new order number from the answer.

**If you delete the name but keep later code using it:** Later code cannot find `response`.

### Part: `await csrfFetch(...)`

**What it says:** Send the request and wait for the answer.

`await` means “pause this job until the answer arrives.”

`csrfFetch` is a helper made in your project for safe browser requests.

**CSRF** means Cross-Site Request Forgery.

It is a type of trick where another website tries to send an unwanted request using a logged-in customer's browser.

Think of CSRF protection as a secret stamp on a real restaurant order ticket.

Laravel rejects a ticket that does not have the correct stamp.

A **request** is a message sent to the server.

A **response** is the server's answer.

**Why it is there:** The cart must talk to Laravel.

**If you delete it:** Pressing Confirm Order will not send anything.

### Part: `'/api/orders'`

**What it says:** Send the request to the order API address.

**Why it is there:** It matches the Laravel route we saw above.

**If you change only this line:** The browser may contact an address that does not exist.

### Line: `method: 'POST'`

**What it says:** We are sending new information.

**Why it is there:** Laravel's order route accepts POST.

**If you delete it:** Browser requests normally use GET. The GET request will not match the POST route.

### Line: `body: JSON.stringify(buildPayload())`

**What it says:** Build the order information and turn it into JSON text.

`body` is the main data inside the request.

**Why it is there:** Laravel needs the branch, customer, fulfillment, payment method, and items.

**If you delete it:** The request arrives without the order details. Validation fails.

---

## 15. The full journey of one order

Let us follow one customer.

### Step 1: The customer opens the website

The browser asks Laravel for the page.

Laravel sends `resources/views/app.blade.php`.

That page contains the empty `root` box.

### Step 2: React starts

Vite loads `resources/js/app.jsx` and the CSS files.

**Vite** is a tool that prepares frontend files for the browser.

React enters the `root` box.

It shows Home, Navbar, and Footer.

### Step 3: The customer opens the menu

React Router sees `/menu`.

It shows `MenuPage.jsx`.

The customer chooses a branch and pizza.

### Step 4: The customer adds pizza to the cart

JavaScript saves the cart in `localStorage`.

**localStorage** is a small storage space inside the browser.

Think of it as a shopping note kept at the customer's table.

It is useful, but it is not trusted by the kitchen.

A customer can change browser data.

### Step 5: The customer confirms the order

`Cart.jsx` builds the order information.

It turns the information into JSON.

It sends a POST request to `/api/orders`.

### Step 6: Laravel finds the route

`routes/web.php` matches `/api/orders`.

It sends the request to `OrderController`.

### Step 7: Laravel checks the order

Laravel checks required fields.

This checking is called **validation**.

Think of validation as the waiter checking the ticket before giving it to the kitchen.

Bad orders are returned with error messages.

### Step 8: Laravel calculates the real price

Laravel does not trust the price stored in the browser.

It reads the real branch price from SQLite.

This stops a customer from changing a pizza price to zero.

### Step 9: Laravel saves the order

Laravel adds rows to the `orders` and `order_items` tables.

A **table** is a database list with named columns, like a spreadsheet.

One row holds one saved record.

### Step 10: Laravel sends an answer

Laravel sends JSON back to React.

The answer contains the created order.

### Step 11: React updates the screen

React shows a success message with the order number.

It clears the cart.

The customer sees the result without reloading the whole website.

---

## 16. A simple picture of the project

```text
CUSTOMER
   |
   | clicks and types
   v
BROWSER
   |
   | React shows the frontend
   | JSON request goes to /api/orders
   v
LARAVEL SERVER
   |
   | checks the order and price
   v
SQLITE DATABASE
   |
   | saves the order
   v
LARAVEL SERVER
   |
   | sends JSON response
   v
REACT IN THE BROWSER
   |
   | shows success
   v
CUSTOMER
```

---

## What you should remember

- The frontend is what the customer sees. The backend is the hidden kitchen.
- The database saves information. This project uses one SQLite file.
- HTML gives structure. CSS gives style. JavaScript gives behavior.
- React builds the browser screens. PHP and Laravel handle server work.
- The browser and Laravel send JSON through API addresses such as `/api/orders`.

---

## Test yourself

Try to answer before reading the answers.

1. What is the frontend?
2. What is the backend?
3. What is the job of `database/database.sqlite`?
4. What does the route `/api/orders` do?
5. Why does Laravel calculate the price again?

---

## Answers

1. The frontend is the part of the website the customer can see and use.
2. The backend is the hidden server code that checks requests, performs work, and sends answers.
3. It is the SQLite database file that stores project information such as users and orders.
4. It accepts a new order request and sends it to the backend order controller.
5. Browser data can be changed by a customer, so Laravel uses the trusted database price.
