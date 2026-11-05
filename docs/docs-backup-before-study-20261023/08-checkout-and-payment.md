# Code Area: Checkout, Order Creation, and Card Payment

This lesson begins on the active Cart page and ends at Stripe's verified webhook.

## 1. Payment imports in `resources/js/Pages/Cart.jsx`

```jsx
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { csrfFetch } from '../lib/api';
```

**What it says:** Bring Stripe's secure card field, Stripe React connection tools, Stripe loader, and the project request helper.

**Why it is there:** Card data must go through Stripe, while order setup goes to Laravel.

**If you delete Stripe imports:** Card checkout cannot render or confirm.

## 2. Load Stripe once

```jsx
const stripePromise = import.meta.env.VITE_STRIPE_KEY
    ? loadStripe(import.meta.env.VITE_STRIPE_KEY)
    : null;
```

**What it says:** If the public Stripe key exists, load Stripe. Otherwise store null.

**Why it is outside the component:** Stripe should load once, not on every Cart redraw.

**If the key is missing:** The page shows a setup message instead of card fields.

A `VITE_` value is public in browser code. Only the publishable Stripe key belongs there. Never put Stripe secret key in a `VITE_` variable.

## 3. Checkout state

```jsx
const [cartItems, setCartItems] = useState([]);
const [selectedBranchId, setSelectedBranchId] = useState(1);
const [orderType, setOrderType] = useState('delivery');
const [paymentMethod, setPaymentMethod] = useState('cash');
const [customer, setCustomer] = useState({
    name: '', phone: '', address: '', pickupTime: ''
});
```

**What it says:** Remember cart, branch, fulfillment, payment choice, and customer fields.

**Why it is there:** Every input must immediately update the screen and final payload.

**If you delete one state:** That part of checkout has no reliable memory.

## 4. Read cart and listen for changes

The first effect calls `readCart()` and listens for both `storage` and `wtc-cart-updated`.

- `storage` helps when another browser tab changes the cart.
- Custom event helps inside the same tab.
- Cleanup removes both listeners.

Without cleanup, old listeners can collect after repeated mounts.

## 5. Display totals

```jsx
const subtotal = useMemo(
    () => cartItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0,
    ),
    [cartItems],
);
const deliveryFee = orderType === 'delivery' && cartItems.length ? 25 : 0;
const total = subtotal + deliveryFee;
```

**What it says:** Add every displayed price times quantity. Add 25 for non-empty delivery.

**Why it is there:** Customers need a preview.

**If you delete it:** Summary cannot show totals.

This is not the trusted charge. Laravel calculates again from its database and config.

## 6. Build the API payload

```jsx
const buildPayload = () => ({
    branch_id: Number(selectedBranchId),
    order_type: orderType,
    customer_name: customer.name,
    customer_phone: customer.phone,
    delivery_address: orderType === 'delivery' ? customer.address : null,
    pickup_time: orderType === 'pickup' ? customer.pickupTime : null,
    payment_method: paymentMethod,
    items: cartItems.map((item) => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        notes: item.notes || null,
    })),
});
```

**What it says:** Change React names into Laravel's expected JSON names. Send only item ID, quantity, and notes.

**Why it is there:** Names, prices, and total from the browser are not trusted by Laravel.

**If you send browser total:** Laravel should still ignore it. Sending less untrusted data is cleaner.

## 7. Cash submission

```jsx
const response = await csrfFetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(buildPayload()),
});
setMessage(`Order #${response.order.id} confirmed successfully.`);
clearCart();
```

**What it says:** Send cash order, show returned ID, and clear cart.

**Why it is there:** The customer needs proof that Laravel created the order.

**If you clear before success:** A failed request can erase the customer's cart.

The surrounding `try/catch/finally` shows the first Laravel field error and always unlocks the button.

## 8. Option-card helper

```jsx
const selection = (name, value, current, onChange, title, copy, icon) => (
    <label className={`wtc-option-card ${current === value ? 'is-selected' : ''}`}>
        <input
            type="radio"
            name={name}
            value={value}
            checked={current === value}
            onChange={() => onChange(value)}
        />
        ...
    </label>
);
```

**What it says:** Make a reusable radio option styled as a card. Mark selected value and update on click.

**Why it is there:** Branch and fulfillment options share one pattern.

**If you delete the actual radio input:** The card loses proper form meaning and keyboard behavior.

## 9. Disable incomplete checkout

```jsx
const disabled = !cartItems.length
    || !customer.name
    || !customer.phone
    || (orderType === 'delivery' && !customer.address)
    || (orderType === 'pickup' && !customer.pickupTime);
```

**What it says:** Disable submit when required visible information is missing.

**Why it is there:** It gives early feedback.

**If you delete it:** Laravel still validates, but users can submit obviously incomplete forms.

Client disabling is not security. Backend validation remains required.

## 10. Cart item notes

The textarea uses:

```jsx
maxLength="200"
value={item.notes || ''}
onChange={(event) => updateItem(item.id, { notes: event.target.value })}
```

It blocks more than 200 typed characters, saves the note, and displays a live count.

Laravel repeats `max:200` because browser rules can be bypassed.

## 11. Pickup time input

```jsx
<input
    type="datetime-local"
    value={customer.pickupTime}
    min={new Date(Date.now() + 20 * 60000).toISOString().slice(0, 16)}
    onChange={(e) => updateCustomer('pickupTime', e.target.value)}
    required
/>
```

**What it says:** Show local date/time control with a minimum roughly 20 minutes from now.

**Why it is there:** Customers get guidance before submission.

**Weak point:** `toISOString()` uses UTC, while `datetime-local` expects local time. Cairo's shown minimum can be shifted. Laravel still checks the real rule.

## 12. Payment choice

Two buttons set `paymentMethod` to cash or card.

Cash shows Confirm Order.

Card shows Stripe Elements when configured.

```jsx
<Elements stripe={stripePromise}>
    <CardCheckout
        payload={buildPayload}
        disabled={disabled}
        onSuccess={clearCart}
        onMessage={setMessage}
    />
</Elements>
```

Elements gives Stripe connection to CardCheckout. Props give it order builder and callbacks.

## 13. `CardCheckout`

### Stripe objects and state

```jsx
const stripe = useStripe();
const elements = useElements();
const [processing, setProcessing] = useState(false);
```

Stripe is the payment tool. Elements finds secure fields. Processing blocks repeated clicks.

### Create a unique key

```jsx
const idempotencyKey = crypto.randomUUID();
```

This creates a unique browser-supported ID for one attempt.

If a network retry sends the same key, Laravel/Stripe can recognize duplicate creation.

### Ask Laravel to start payment

```jsx
const response = await csrfFetch('/api/payments/intents', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify({
        ...payload(),
        payment_method: 'card',
        idempotency_key: idempotencyKey,
    }),
});
```

**What it says:** Send full order details and unique key to Laravel.

**Why it is there:** Laravel must calculate the trusted total before Stripe receives an amount.

**If you create PaymentIntent only in React:** Secret Stripe access and trusted pricing are lost.

### Confirm card with Stripe

```jsx
const result = await stripe.confirmCardPayment(response.client_secret, {
    payment_method: { card: elements.getElement(CardElement) },
});
```

Stripe reads raw card details from its hosted CardElement.

Laravel does not receive them.

If Stripe reports an error, code throws and shows its message.

Browser success says payment is being confirmed. The webhook is still the final proof.

## 14. `app/Contracts/PaymentGateway.php`

```php
interface PaymentGateway
{
    public function createIntent(...): array;
    public function parseWebhook(...): object;
}
```

**What it says:** Every payment provider must offer these two jobs.

**Why it is there:** Controllers do not need Stripe-specific code.

**If you delete it:** Dependency injection and payment tests using a fake break.

## 15. `StripePaymentGateway.php`

### Create intent

```php
$intent = (new StripeClient(config('services.stripe.secret')))
    ->paymentIntents->create([
        'amount' => $amount,
        'currency' => $currency,
        'automatic_payment_methods' => ['enabled' => true],
        'metadata' => $metadata,
    ], ['idempotency_key' => $idempotencyKey]);
```

**What it says:** Use secret key to ask Stripe for a PaymentIntent with amount, currency, order metadata, and duplicate protection.

**Why it is there:** Stripe must know how much to collect and which order it belongs to.

**If secret key is exposed to frontend:** Anyone could misuse the Stripe account. Keep it server-only.

### Verify webhook

```php
return Webhook::constructEvent(
    $payload,
    $signature,
    config('services.stripe.webhook_secret'),
);
```

**What it says:** Ask Stripe's library to prove the message matches the webhook secret.

**Why it is there:** Anyone can call a public URL. Only valid signatures should change payment state.

**If you skip verification:** An attacker could send a fake “paid” message.

## 16. `PaymentController::createIntent`

The method:

1. Receives already validated StoreOrderRequest.
2. Requires `payment_method` card.
3. Reads `Idempotency-Key` header or body.
4. Requires a key.
5. Returns 409 if an order already uses that key.
6. Creates order as `payment_pending` using OrderCreator.
7. Converts pounds to smallest units with `round(total * 100)`.
8. Asks PaymentGateway to create the intent in EGP.
9. Saves Stripe name and intent ID.
10. Deletes pending order if Stripe creation throws an error.
11. Returns order ID, client secret, and publishable key with 201.

Deleting the pending status would risk staff seeing an unpaid order.

## 17. `PaymentController::webhook`

### Verify first

```php
try {
    $event = $gateway->parseWebhook(
        $request->getContent(),
        (string) $request->header('Stripe-Signature'),
    );
} catch (Throwable) {
    return response()->json(['message' => 'Invalid webhook signature.'], 400);
}
```

Invalid signatures stop immediately.

### Find order

Stripe's object ID is matched against `gateway_reference`.

If no order exists, Laravel returns received true. This prevents Stripe from retrying forever for an unknown old event.

### Success

```php
if ($event->type === 'payment_intent.succeeded'
    && $order->payment_status !== 'paid') {
```

The second check stops repeated success webhooks from doing the transition twice.

Inside a transaction, Laravel changes payment to paid, status to new, and creates one log from payment_pending to new.

Then it dispatches OrderPlaced.

### Failure

`payment_intent.payment_failed` changes payment status to failed.

The project does not yet handle refunds, cancellations, or clearing old pending orders.

## 18. Payment provider binding

`AppServiceProvider` binds PaymentGateway to StripePaymentGateway. This was explained in the server lesson.

Tests can replace the interface with a fake instead of contacting real Stripe.

## 19. Payment config and environment

`config/services.php` reads:

- `STRIPE_KEY`: public/publishable key;
- `STRIPE_SECRET`: private server key;
- `STRIPE_WEBHOOK_SECRET`: signed-message secret.

`.env.example` also exposes `VITE_STRIPE_KEY="${STRIPE_KEY}"` for browser use.

In real deployment, confirm only the publishable key is exposed.

## 20. Payment test

`test_verified_payment_webhook_marks_order_paid_once` creates a pending order and a fake PaymentGateway event.

It calls webhook twice.

Then it checks:

- order is paid;
- status is new;
- exactly one status log exists.

This proves duplicate delivery is safe without calling Stripe.

Missing tests include intent amount creation, duplicate key 409, and failed payment behavior.

## What you should remember

- The browser total is only a preview; Laravel calculates the trusted total.
- Stripe's CardElement keeps raw card data away from Laravel.
- Card orders stay pending and hidden from staff until a signed webhook succeeds.
- Idempotency protects against duplicate payment creation and webhook handling.
- PaymentGateway keeps controllers separate from Stripe-specific details.

## Test yourself

1. Why does Laravel calculate the total again?
2. Where do raw card details go?
3. What status does a new card order start with?
4. What finally proves the payment succeeded?
5. Why is an idempotency key useful?

## Answers

1. Browser prices can be changed by a user.
2. Directly to Stripe through the hosted CardElement.
3. `payment_pending`.
4. A Stripe webhook with a valid signature.
5. It stops retries/double-clicks from creating duplicate payment attempts or orders.
