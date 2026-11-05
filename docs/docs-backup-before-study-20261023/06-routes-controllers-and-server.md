# Code Area: Laravel Startup, Routes, Controllers, Services, Config, and Tests

This lesson explains how Laravel receives a request and sends it to the correct code.

Think of it as the path from the restaurant door to the correct kitchen station.

## 1. `public/index.php`

This is Laravel's public server entrance.

The web server sends normal website requests here.

It loads Composer's PHP files, starts Laravel, and asks Laravel to handle the request.

You normally do not edit it.

If it disappeared, the web server could not enter Laravel.

## 2. `bootstrap/app.php`

### Real code: create the application

```php
return Application::configure(basePath: dirname(__DIR__))
```

**What it says:** Start a Laravel application using the project folder as its base.

**Why it is there:** Laravel needs to know where the project files live.

**If you delete it:** Laravel cannot create the application.

### Real code: load route files

```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    channels: __DIR__.'/../routes/channels.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)
```

**What it says:** Load browser routes, broadcast channel rules, terminal commands, and a simple health address.

**Why it is there:** Laravel needs all four kinds of entry points.

**If you delete `web`:** Website and API routes are not loaded.

**If you delete `channels`:** Private broadcast authorization is not loaded.

**If you delete `commands`:** Custom terminal commands are not loaded.

### Real code: middleware setup

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->alias(['role' => RequireRole::class]);
    $middleware->validateCsrfTokens(except: ['api/payments/webhook']);
})
```

**What it says:** Give RequireRole the short name `role`. Skip browser CSRF checking only for Stripe's webhook.

**Why it is there:** Routes can write `role:staff,admin`. Stripe is a server, not a browser, so it cannot send the page's CSRF token.

**If you delete the alias:** Staff routes cannot find middleware named `role`.

**If you remove the webhook exception:** Stripe webhook requests are rejected for missing browser CSRF.

Webhook security still uses Stripe's signature. The exception does not mean “trust everyone.”

### Real code: finish

```php
->withExceptions(function (Exceptions $exceptions): void {
    //
})->create();
```

**What it says:** Leave custom exception setup empty, then create the application.

**Why it is there:** Laravel supports future error customization and needs the final `create()` call.

**If you delete `create()`:** No application object is returned.

## 3. `bootstrap/providers.php`

```php
return [
    AppServiceProvider::class,
];
```

**What it says:** Load the project's main service provider during startup.

**Why it is there:** AppServiceProvider connects the payment interface to Stripe.

**If you delete the provider:** Laravel may fail when a controller asks for `PaymentGateway`.

## 4. Why API routes are in `routes/web.php`

Many Laravel projects have `routes/api.php`.

This project does not.

All API routes are inside a group in `web.php`.

That means they naturally use Laravel's web session and CSRF protection.

This fits a React app served from the same Laravel website.

It is not automatically wrong. It is a design choice.

## 5. `routes/web.php`

### Real code: imports

```php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\StaffOrderController;
use Illuminate\Support\Facades\Route;
```

**What it says:** Bring all needed controller classes and Laravel's Route tool into this file.

**Why it is there:** Routes below can use short class names.

**If you delete one controller import:** Any route using that short name fails.

### Real code: API prefix

```php
Route::prefix('api')->group(function () {
```

**What it says:** Put `/api` before every route inside the block.

**Why it is there:** API addresses are clearly separated from screen addresses.

**If you delete it:** `/api/orders` becomes `/orders`, while React still calls `/api/orders`.

### Menu and auth routes

```php
Route::get('/menu', [MenuController::class, 'index']);
Route::get('/auth/me', [AuthController::class, 'me']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/logout', [AuthController::class, 'logout']);
```

GET menu reads data. GET me reads current user. POST routes change login/account state.

If an HTTP method does not match, Laravel will not choose that route.

### Order and payment routes

```php
Route::post('/orders', [OrderController::class, 'store']);
Route::post('/payments/intents', [PaymentController::class, 'createIntent']);
Route::post('/payments/webhook', [PaymentController::class, 'webhook']);
```

- `/orders` creates cash orders.
- `/payments/intents` starts card payment.
- `/payments/webhook` receives Stripe's later server message.

### Staff routes

```php
Route::middleware(['auth', 'role:staff,admin'])->prefix('staff')->group(function () {
    Route::get('/orders', [StaffOrderController::class, 'index']);
    Route::get('/orders/{order}', [StaffOrderController::class, 'show']);
    Route::patch('/orders/{order}/status', [StaffOrderController::class, 'updateStatus']);
});
```

**What it says:** Require logged-in staff/admin. Add `/staff`. List, show, or change an order.

`{order}` is a variable part of the address. Laravel automatically loads that Order row. This is route model binding.

If the order ID does not exist, Laravel returns 404.

### React catch-all route

```php
Route::get('/{view?}', function () {
    return view('app');
})->where('view', '^(?!api).*$');
```

**What it says:** For any remaining non-API GET address, return `app.blade.php`.

**Why it is there:** A direct refresh on `/cart` still needs the React HTML shell.

**If you delete it:** Directly opening React routes can return 404 even though clicking inside the SPA works.

The final pattern avoids catching addresses beginning with `api`.

## 6. `routes/channels.php`

```php
Broadcast::channel('staff.orders', fn ($user) => $user->isStaff());
```

**What it says:** Only staff/admin may listen to the private `staff.orders` channel.

**Why it is there:** Order messages contain private customer information.

**If you return true for everyone:** Any authenticated user might listen once a WebSocket client is connected.

The current React dashboard does not connect to this channel yet. It polls instead.

## 7. `routes/console.php`

```php
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
```

**What it says:** Add a terminal command named `inspire` that prints a quote.

**Why it is there:** It is Laravel's sample custom command.

**If you delete it:** Only that sample command disappears. The website keeps working.

## 8. `app/Http/Controllers/Controller.php`

```php
abstract class Controller
{
    //
}
```

**What it says:** Create a shared parent class that is not used directly.

**Why it is there:** API controllers can share behavior here later.

**If you delete it:** Every controller extending it fails until changed.

## 9. `MenuController.php`

### Real code: branch input

```php
$branchId = $request->integer('branch_id');
```

**What it says:** Read `branch_id` from the URL query and convert it to an integer.

**Why it is there:** Menu prices depend on branch.

**If you delete it:** The controller cannot limit item branch data.

### Real code: branches and categories

```php
$branches = Branch::query()->orderBy('name')->get();
$categories = Category::query()->orderBy('id')->get();
```

**What it says:** Read all branches alphabetically and all categories by ID.

**Why it is there:** The frontend needs branch/category choices.

**If you delete either query:** That list is missing from the JSON response.

### Real code: eager-load items

```php
$items = MenuItem::query()
    ->with(['category', 'branches' => function ($query) use ($branchId) {
        if ($branchId > 0) {
            $query->where('branches.id', $branchId);
        }
    }])
```

**What it says:** Load each item's category and linked branches. If a branch was requested, keep only that branch link.

**Why it is there:** One grouped database operation avoids asking separately for each relationship.

**If you delete `with`:** Mapping category and branch can cause extra queries or missing loaded data.

### Real code: shape the JSON

```php
return [
    'id' => $item->id,
    'category' => $item->category?->name,
    'name' => $item->name,
    'price' => $branch?->pivot?->price,
    'is_available' => (bool) ($branch?->pivot?->is_available ?? false),
];
```

**What it says:** Send only the useful fields in a predictable shape.

**Why it is there:** React should not need to understand raw pivot models.

**If you delete price/availability:** A branch menu cannot show ordering rules.

## 10. `OrderController.php`

```php
public function store(StoreOrderRequest $request, OrderCreator $creator): JsonResponse
{
    $data = $request->validated();
    if ($data['payment_method'] === 'card') {
        throw ValidationException::withMessages([
            'payment_method' => ['Card orders must use the payment intent endpoint.'],
        ]);
    }

    $order = $creator->create($data, $request->user(), Order::STATUS_NEW);
    OrderPlaced::dispatch($order);

    return response()->json(['message' => 'Order created successfully.', 'order' => $order], 201);
}
```

**What it says:** Use checked data. Reject card orders on the cash endpoint. Create a new order, announce it, and return status 201.

**Why it is there:** Cash and card have different safety flows.

**If you delete the card check:** A card order could be created as new before payment.

**If you delete OrderCreator:** The controller no longer saves order details or trusted prices.

## 11. `StoreOrderRequest.php`

This file checks checkout data before controllers run.

### Authorization and default

```php
public function authorize(): bool
{
    return true;
}

protected function prepareForValidation(): void
{
    $this->merge(['payment_method' => $this->input('payment_method', 'cash')]);
}
```

Guest customers are allowed. Missing payment method becomes cash.

If `authorize` returned false, every order would receive 403.

### Main rules

```php
'branch_id' => ['required', 'integer', 'exists:branches,id'],
'order_type' => ['required', Rule::in(['delivery', 'pickup', 'dine_in'])],
'delivery_address' => ['nullable', 'required_if:order_type,delivery', 'string', 'max:500'],
'pickup_time' => ['nullable', 'required_if:order_type,pickup', 'date'],
'items' => ['required', 'array', 'min:1'],
'items.*.quantity' => ['required', 'integer', 'min:1', 'max:20'],
'items.*.notes' => ['nullable', 'string', 'max:200'],
```

These rules require a real branch, allowed fulfillment, matching address/time, at least one item, safe quantity, and short notes.

Delete a rule and that bad input is no longer stopped at this door.

### Extra pickup check

The `after()` method runs after basic rules. It uses Carbon to compare arrival with now plus configured preparation minutes.

It also checks branch opening attributes if they exist. Current Branch table has no opening columns, so that part does not run.

## 12. `OrderCreator.php`

This service does the real order work for both cash and card.

### Transaction start

```php
return DB::transaction(function () use ($data, $user, $status) {
```

**What it says:** Run all enclosed database changes as one group.

**Why it is there:** Do not save half an order.

**If you remove the transaction:** A failure after order creation could leave an order without all items.

### Create order shell

The `Order::create` block saves user, branch, type, customer details, relevant address/time, payment states, idempotency key, and total zero.

Total starts at zero because Laravel calculates it next.

### Check every line

```php
$pivot = DB::table('branch_menu_item')
    ->where('branch_id', $branch->id)
    ->where('menu_item_id', $line['menu_item_id'])
    ->first();

if (! $pivot || ! $pivot->is_available) {
    throw ValidationException::withMessages([...]);
}
```

**What it says:** Find this branch's product price/availability. Reject missing or unavailable items.

**Why it is there:** Browser cart data is not trusted.

**If you delete the availability check:** Customers can order products unavailable at that branch.

### Calculate and save line

```php
$price = (float) $pivot->price;
$quantity = (int) $line['quantity'];
$total += $price * $quantity;
$order->items()->create([
    'menu_item_id' => $line['menu_item_id'],
    'quantity' => $quantity,
    'price' => $price,
    'notes' => $line['notes'] ?? null,
]);
```

The server price builds total and is copied into history.

Delete this and the order has no lines or correct total.

### Fee and return

Delivery adds `config('orders.delivery_fee', 25)`. Then total updates and the complete order loads relationships.

One weakness: it runs one pivot query per line. A larger cart should load all needed pivots in one query.

## 13. `UpdateOrderStatusRequest.php`

```php
'status' => ['required', Rule::in(Order::STAFF_STATUSES)],
'reason' => ['nullable', 'required_if:status,cancelled,rejected', 'string', 'max:500'],
```

Status must be known. Cancel/reject needs a reason.

Delete the status list and unknown status text can reach the controller.

## 14. `StaffOrderController.php`

### Index filters

It validates optional status, branch ID, and date.

The query eager-loads branch, user, item/menu, and status-log/user.

```php
->where('status', '!=', Order::STATUS_PAYMENT_PENDING)
->where(fn ($query) => $query
    ->where('payment_method', 'cash')
    ->orWhere('payment_status', 'paid'))
```

This hides pending and unpaid card orders from the kitchen.

Delete it and staff could prepare unpaid card orders.

`when()` adds branch/date/status filters only when supplied.

### Show

`show(Order $order)` loads one order's relationships and returns JSON.

### Update status

The method gets validated status, reads allowed transitions, and narrows Ready based on delivery or pickup.

Illegal movement throws a validation error.

A transaction changes order and writes OrderStatusLog together.

Then it loads fresh data, dispatches `OrderStatusUpdated`, and returns the order.

Delete logging and the current status changes, but history is lost.

## 15. Events

### `app/Events/OrderPlaced.php`

```php
class OrderPlaced implements ShouldBroadcastNow
```

This says the event should broadcast immediately, not wait in a queue.

The constructor stores the Order.

`broadcastOn()` chooses private `staff.orders`.

`broadcastAs()` names the event `OrderPlaced`.

`broadcastWith()` sends only the order ID.

### `OrderStatusUpdated.php`

It follows the same structure and sends order ID plus status.

If these events are deleted, polling still works, but future connected real-time clients receive nothing.

## 16. `AppServiceProvider.php`

```php
$this->app->bind(PaymentGateway::class, StripePaymentGateway::class);
```

**What it says:** When code asks for PaymentGateway, create StripePaymentGateway.

**Why it is there:** Controllers depend on a general payment promise, not Stripe details.

**If you delete it:** Laravel does not know which concrete class to inject.

The empty `boot()` method is a normal place for future startup behavior.

## 17. Remaining config files

### `config/app.php`

Reads app name, environment, debug, URL, timezone, language, encryption key, and maintenance settings.

`APP_KEY` is very important. Laravel uses it for protected/encrypted values. Never share a production key.

### `config/cache.php`

Lists array, database, file, Memcached, Redis, DynamoDB, Octane, and failover cache stores.

`.env` chooses one default. The local example chooses database.

### `config/filesystems.php`

Defines local private storage, public local storage, and Amazon S3.

It also defines the `public/storage` symbolic link.

### `config/logging.php`

Defines places errors/messages can go: one file, daily files, Slack, stderr, system log, and null.

Local default stack usually writes to `storage/logs/laravel.log`.

### `config/mail.php`

Defines SMTP and outside mail services, plus log/array options useful in development/tests.

The project currently has no main customer email feature.

### `config/orders.php`

```php
'minimum_pickup_prep_minutes' => (int) env('ORDER_MIN_PICKUP_PREP_MINUTES', 20),
'delivery_fee' => (float) env('ORDER_DELIVERY_FEE', 25),
```

These are project-specific business settings. Changing `.env` changes the rule without editing services.

### `config/queue.php`

Lists immediate, database, Beanstalkd, Amazon SQS, Redis, background, deferred, and failover queue choices.

It also configures job batches and failed jobs.

### `config/services.php`

Stores settings for Postmark, Resend, AWS SES, Slack, and Stripe.

Stripe uses `STRIPE_KEY`, `STRIPE_SECRET`, and `STRIPE_WEBHOOK_SECRET` from `.env`.

### `config/auth.php`, `config/database.php`, `config/session.php`

These were explained in login and database lessons.

## 18. Test files

### `tests/TestCase.php`

This is the shared parent for project tests. Laravel's testing tools start here.

### `tests/Unit/ExampleTest.php`

Checks that `true` is true. It proves the unit test setup runs, but does not test business behavior.

### `tests/Feature/ExampleTest.php`

Requests `/` and expects a successful answer.

### `tests/Feature/OrderOperationsTest.php`

`RefreshDatabase` rebuilds a clean test database.

`setUp()` seeds menu data and fakes broadcast events.

Tests check:

- guest/customer/staff route protection;
- invalid and valid status movement plus log;
- pickup preparation time and saved notes;
- payment webhook called twice creates only one paid transition log.

If these tests are deleted, the app may run, but you lose automatic protection against regressions.

### `phpunit.xml`

It chooses test folders and safe settings.

Important test values include in-memory SQLite, array session/cache/mail, null broadcasting, and sync queues.

This keeps tests quick and separate from real local data.

## What you should remember

- `bootstrap/app.php` starts Laravel and loads routes/middleware.
- `routes/web.php` connects HTTP addresses to controllers.
- Form Requests check data; controllers coordinate; services do shared business work.
- Config files hold changeable settings and external-service keys.
- Tests prove important behavior without using the normal database.

## Test yourself

1. Why are API routes in `web.php` here?
2. What does OrderCreator's transaction protect?
3. Why is Stripe webhook excluded from CSRF?
4. What does AppServiceProvider bind?
5. What database does the test suite use?

## Answers

1. The same-origin React app uses Laravel web sessions and CSRF protection.
2. It prevents half an order from being saved when one step fails.
3. Stripe is a server and cannot know the browser page's CSRF token; a Stripe signature protects it instead.
4. It connects PaymentGateway to StripePaymentGateway.
5. A temporary in-memory SQLite database.
