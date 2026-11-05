# Feature Tour: What Users See and What the Code Does

This lesson follows each visible feature.

For every feature, we will ask:

1. What does the user see?
2. What happens behind the screen?
3. Which files are involved?

## 1. Hero video

### What the user sees

The homepage opens with a pizza video.

The top navigation and hero words are hidden at first.

During the final two video seconds, the video slowly changes from normal speed to about `0.28x` speed.

At that moment, the navigation slides down and the hero words fade upward.

The video plays once. It ends on its final frame.

### Real code

```jsx
const slowdownStart = Math.max(0, video.duration - 2);

if (video.currentTime >= slowdownStart) {
    video.playbackRate = 1 - (0.72 * easedProgress);
    revealContent();
}
```

### Plain explanation

- `duration - 2` finds the start of the final two video seconds.
- `currentTime` tells us the video's current position.
- `playbackRate` controls speed. `1` is normal speed.
- `revealContent()` tells the parent that the words and Navbar may appear.

If this block was deleted, the ending would not slow down and content would wait until the final fallback event.

### Files

- `resources/js/Pages/Home.jsx`
- `resources/js/app.jsx`
- `resources/js/Components/Navbar.jsx`
- `public/videos/hero-pizza-motion.mp4`

## 2. Menu and branch selection

### What the user sees

The customer opens Menu.

They first choose Nasr City, New Cairo, or Maadi.

Then they choose a category and see products available at that branch.

### Real code

```jsx
const filteredItems = useMemo(() => {
    if (!selectedBranch) return [];

    return menuItems.filter((item) => (
        item.category === activeCategory && item.available_branches.includes(selectedBranch.id)
    ));
}, [activeCategory, menuItems, selectedBranch]);
```

### Plain explanation

- `useMemo` remembers a calculation until its inputs change.
- No branch means no products are returned.
- `filter` keeps products in the selected category and branch.

If this block was deleted, the screen would not know which products to show.

### Important truth

The visible Menu page currently keeps menu data inside `MenuPage.jsx`.

Laravel also has a real `/api/menu` endpoint and database menu.

The active page does not call it yet.

That means there are two menu copies. They can become different.

### Files

- `resources/js/Pages/MenuPage.jsx`
- `app/Http/Controllers/Api/MenuController.php` (prepared API)
- `app/Models/Branch.php`
- `app/Models/MenuItem.php`
- `database/seeders/MenuCatalogSeeder.php`

## 3. Add to cart

### What the user sees

The customer presses Add to Cart.

A success message appears.

The cart number in the Navbar increases.

### Real code

```jsx
localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
window.dispatchEvent(new Event(CART_EVENT_NAME));
```

### Plain explanation

- The first line saves the cart as JSON in the browser.
- The second line announces that the cart changed.
- Navbar listens for that announcement and recounts items.

If the first line was deleted, the cart would not survive navigation or refresh.

If the second line was deleted, the Navbar count might not update immediately in the same tab.

### Files

- `resources/js/Pages/MenuPage.jsx`
- `resources/js/Pages/Home.jsx`
- `resources/js/Pages/Cart.jsx`
- `resources/js/Components/Navbar.jsx`

## 4. Cart editing

### What the user sees

The cart shows each product, quantity, price, remove button, and kitchen note box.

The customer can increase, decrease, remove, or clear items.

### Real code

```jsx
const updateItem = (id, changes) => {
    const next = cartItems.map((item) => item.id === id ? { ...item, ...changes } : item);
    setCartItems(next);
    writeCart(next);
};
```

### Plain explanation

- The function receives an item ID and the values to change.
- `map` creates a new list.
- The matching item gets the new values.
- React state and browser storage both receive the list.

If this function was deleted, quantity and notes could not update through the current page.

### Files

- `resources/js/Pages/Cart.jsx`
- `resources/js/Components/CartDrawer.jsx` (older unused cart)

## 5. Branch and fulfillment

### What the user sees

The customer chooses a branch.

They choose Delivery or Pickup.

Delivery asks for an address.

Pickup asks for an arrival time.

### Real code

```jsx
delivery_address: orderType === 'delivery' ? customer.address : null,
pickup_time: orderType === 'pickup' ? customer.pickupTime : null,
```

### Plain explanation

- Delivery sends the address and no pickup time.
- Pickup sends the time and no address.
- `null` means no value.

If these conditions were removed, the server could receive fields that do not match the chosen fulfillment type.

### Files

- `resources/js/Pages/Cart.jsx`
- `app/Http/Requests/StoreOrderRequest.php`
- `app/Services/Orders/OrderCreator.php`

## 6. Pickup time

### What the user sees

Pickup shows a date and time input.

The page says to allow at least 20 minutes.

### Real code

```php
$earliest = now()->addMinutes(config('orders.minimum_pickup_prep_minutes', 20));

if ($arrival->lt($earliest)) {
    $validator->errors()->add('pickup_time', 'Pickup must be later.');
}
```

### Plain explanation

- Laravel finds the earliest allowed time.
- It reads the number from `config/orders.php`.
- If the customer's time is earlier, Laravel adds an error.

If this backend check was deleted, a customer could change browser rules and request an impossible pickup time.

### Files

- `resources/js/Pages/Cart.jsx`
- `app/Http/Requests/StoreOrderRequest.php`
- `config/orders.php`
- `app/Models/Order.php`

## 7. Kitchen notes

### What the user sees

Each cart line has an optional note.

Example: “no onions, extra cheese.”

The maximum is 200 characters.

Staff see the note on the order card.

### Real code

```php
'items.*.notes' => ['nullable', 'string', 'max:200'],
```

### Plain explanation

- `items.*` means every item in the list.
- `nullable` means the note may be empty.
- If present, it must be text with at most 200 characters.

If this rule was deleted, very large or wrong note values could reach order creation.

### Files

- `resources/js/Pages/Cart.jsx`
- `app/Http/Requests/StoreOrderRequest.php`
- `app/Models/OrderItem.php`
- `app/Services/Orders/OrderCreator.php`
- `resources/js/Pages/StaffDashboard.jsx`

## 8. Cash order

### What the user sees

The customer chooses cash and presses Confirm Order.

The cart shows the new order number and clears.

### Real code

```php
$order = $creator->create($data, $request->user(), Order::STATUS_NEW);
OrderPlaced::dispatch($order);
```

### Plain explanation

- `OrderCreator` saves the checked order with status `new`.
- The second line announces the new order.

If creation was deleted, nothing would be saved.

If the event was deleted, future real-time listeners would not hear about the order. Polling would still find it later.

### Files

- `resources/js/Pages/Cart.jsx`
- `routes/web.php`
- `app/Http/Controllers/Api/OrderController.php`
- `app/Services/Orders/OrderCreator.php`

## 9. Card payment

### What the user sees

The customer chooses Pay by Card.

Stripe shows a secure card field.

After payment, the page says the order is being confirmed.

### Real code

```jsx
const result = await stripe.confirmCardPayment(response.client_secret, {
    payment_method: { card: elements.getElement(CardElement) },
});
```

### Plain explanation

- Stripe receives the card details from its own secure field.
- `client_secret` connects the browser to the payment Laravel created.
- Raw card numbers do not enter Laravel or the project database.

If this call was deleted, the card payment would never be confirmed in the browser.

### Behind the screen

1. Laravel calculates the real order total.
2. Laravel creates a pending order.
3. Laravel asks Stripe to create a PaymentIntent.
4. Browser confirms it using Stripe.js.
5. Stripe later sends a signed webhook to Laravel.
6. Laravel marks the order paid and new.
7. Only then can staff see it.

### Files

- `resources/js/Pages/Cart.jsx`
- `app/Contracts/PaymentGateway.php`
- `app/Services/Payments/StripePaymentGateway.php`
- `app/Http/Controllers/Api/PaymentController.php`
- `config/services.php`

## 10. Registration and login

### What the user sees

Customers can create an account and log in.

After login, Navbar changes from Login to the user's name.

Staff go directly to `/staff`.

### Real code

```jsx
const user = await login(form);
navigate(['staff', 'admin'].includes(user.role) ? '/staff' : '/menu');
```

### Plain explanation

- The page waits for AuthContext to log in.
- It reads the returned role.
- Staff/admin go to the dashboard. Customers go to Menu.

If the role check was deleted, staff would land on the normal customer page.

### Behind the screen

Laravel checks the email/password.

It creates a session.

The browser keeps a protected session cookie.

AuthContext saves the user in React state so all components update.

### Files

- `resources/js/Pages/Auth/Login.jsx`
- `resources/js/Pages/Auth/Register.jsx`
- `resources/js/context/AuthContext.jsx`
- `resources/js/lib/api.js`
- `app/Http/Controllers/Api/AuthController.php`
- `config/auth.php`
- `config/session.php`

## 11. Staff dashboard

### What staff see

Staff see tabs for New, Accepted, Preparing, Ready, Delivery, Pickup, Completed, Cancelled, and Rejected.

Cards show customer, phone, branch, fulfillment, notes, payment, and total.

### Real code

```jsx
useEffect(() => {
    loadOrders();
    const timer = window.setInterval(loadOrders, 7000);
    return () => window.clearInterval(timer);
}, [loadOrders]);
```

### Plain explanation

- Load orders immediately.
- Ask again every 7,000 milliseconds, which is seven seconds.
- Stop the timer when the page closes or the setup changes.

If the first line was deleted, the dashboard would wait seven seconds before first data.

If cleanup was deleted, old timers could keep running.

### Files

- `resources/js/Pages/StaffDashboard.jsx`
- `app/Http/Controllers/Api/StaffOrderController.php`
- `app/Http/Middleware/RequireRole.php`
- `app/Models/Order.php`

## 12. Notifications

### What staff see and hear

When polling finds a new order, the page shows a red message and highlights the card.

It can also play a short beep after staff enable sound.

### Important truth

Laravel has broadcast event files.

But React does not currently connect through Echo or Reverb.

The active notification system is seven-second polling.

### Files

- `resources/js/Pages/StaffDashboard.jsx`
- `app/Events/OrderPlaced.php`
- `app/Events/OrderStatusUpdated.php`
- `routes/channels.php`

## 13. Order statuses

### What staff do

Staff press buttons to move an order through allowed steps.

```text
new -> accepted -> preparing -> ready
ready -> out_for_delivery -> completed
ready -> picked_up -> completed
```

Orders can also be rejected or cancelled when allowed.

### Real code

```php
public const TRANSITIONS = [
    self::STATUS_NEW => [self::STATUS_ACCEPTED, self::STATUS_REJECTED, self::STATUS_CANCELLED],
    self::STATUS_ACCEPTED => [self::STATUS_PREPARING, self::STATUS_CANCELLED],
];
```

### Plain explanation

- Each left side is the current status.
- Each right-side list contains allowed next statuses.
- A new order cannot jump directly to ready.

If this rule map was deleted without replacement, status changes would have no clear shared path.

Every accepted change also creates an `order_status_logs` row.

That row remembers who changed it, old status, new status, reason, and time.

### Files

- `app/Models/Order.php`
- `app/Models/OrderStatusLog.php`
- `app/Http/Requests/UpdateOrderStatusRequest.php`
- `app/Http/Controllers/Api/StaffOrderController.php`
- `resources/js/Pages/StaffDashboard.jsx`

## What you should remember

- React controls what customers and staff see.
- Laravel rechecks important information before saving anything.
- Browser prices are previews; database prices are trusted.
- Card orders become visible only after Stripe's verified webhook.
- Staff updates currently arrive by polling every seven seconds.

## Test yourself

1. Where is the visible menu data currently stored?
2. Why does Laravel check pickup time again?
3. Does Laravel receive raw card numbers?
4. How does the staff dashboard currently find new orders?
5. Why is the order transition map useful?

## Answers

1. It is currently hard-coded in `MenuPage.jsx`.
2. Browser rules can be changed, so the server must enforce the real rule.
3. No. Stripe's secure field receives them.
4. It polls the server every seven seconds.
5. It stops orders from jumping to invalid status steps.
