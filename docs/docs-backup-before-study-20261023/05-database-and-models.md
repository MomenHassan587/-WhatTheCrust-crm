# Code Area: Database, Migrations, Models, Seeders, and Factories

The database is the restaurant's permanent record book.

React does not write this book directly.

Laravel reads and writes it.

## 1. Why SQLite?

The file is:

```text
database/database.sqlite
```

SQLite keeps the whole local database in one file.

There is no separate database server to install.

That makes the project easy to run and test on one computer.

The file is binary. Do not edit it like a normal text file.

If you delete it, local saved data is lost. Migrations and seeders can rebuild the structure and demo data, but not personal orders that were only in that file.

## 2. `config/database.php`

### Real code: choose default

```php
'default' => env('DB_CONNECTION', 'sqlite'),
```

**What it says:** Read `DB_CONNECTION` from `.env`. Use SQLite if it is missing.

**Why it is there:** Development can use SQLite while another server can choose MySQL or PostgreSQL.

**If you delete it:** Laravel has no clear default connection.

### Real code: SQLite connection

```php
'sqlite' => [
    'driver' => 'sqlite',
    'url' => env('DB_URL'),
    'database' => env('DB_DATABASE', database_path('database.sqlite')),
    'prefix' => '',
    'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
],
```

- `driver` chooses SQLite.
- `url` allows one complete connection URL if supplied.
- `database` points to the file.
- `prefix` would add text before table names; it is empty.
- Foreign-key constraints keep table links valid.

If you change the file path incorrectly, Laravel cannot find the database.

The same config file contains MySQL, MariaDB, PostgreSQL, SQL Server, and Redis choices. They are standard options, not all active at once.

## 3. What is a migration?

A migration is a recipe for database tables.

Every migration has:

```php
public function up(): void
{
    // Make the change.
}

public function down(): void
{
    // Undo the change.
}
```

`up` runs during `php artisan migrate`.

`down` runs during rollback.

Deleting a migration after other people have used it makes database history difficult to rebuild.

## 4. Users, reset tokens, and sessions migration

File: `database/migrations/0001_01_01_000000_create_users_table.php`

### Real code: users

```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->rememberToken();
    $table->timestamps();
});
```

**What it says:** Create a users table with ID, name, unique email, optional verification time, password hash, remember token, created time, and updated time.

**Why it is there:** Registration and login need saved users.

**If you delete `unique`:** Two accounts could use the same email.

**If you delete password:** Login has no saved hash to check.

`timestamps()` creates `created_at` and `updated_at`.

The same file creates `password_reset_tokens` and `sessions`. Removing sessions breaks the configured database session driver.

## 5. Cache migration

File: `0001_01_01_000001_create_cache_table.php`

It creates `cache` and `cache_locks`.

- Cache holds temporary fast values.
- Locks stop two jobs from changing the same cached job at once.

The project can use database cache from `.env`.

Deleting these tables while database cache is selected causes cache errors.

## 6. Jobs migration

File: `0001_01_01_000002_create_jobs_table.php`

It creates:

- `jobs`: waiting background work;
- `job_batches`: groups of jobs;
- `failed_jobs`: jobs that crashed.

The current main order events broadcast immediately, but Laravel's development command starts a queue listener. These tables support future/background jobs.

## 7. Branch migration

File: `2026_06_14_000001_create_branches_table.php`

```php
Schema::create('branches', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('location');
    $table->timestamps();
});
```

This creates one row per restaurant branch.

If `id` was missing, orders would have no stable branch number.

Opening and closing time columns do not exist here. The pickup validator checks for them only if they exist, so opening-hour validation is not active.

## 8. Category migration

File: `2026_06_14_000002_create_categories_table.php`

```php
$table->string('name')->unique();
$table->string('slug')->unique();
```

`name` is display text such as Pizzas.

`slug` is a simple machine-friendly name such as `pizzas`.

Unique stops duplicates.

## 9. Menu item migration

File: `2026_06_14_000003_create_menu_items_table.php`

```php
$table->foreignId('category_id')->constrained()->cascadeOnDelete();
$table->string('name');
$table->text('description');
```

**What it says:** Every product belongs to a category. It has a name and longer description.

**Why it is there:** The product's shared information should not be repeated for every branch.

**If the foreign key is deleted:** The database no longer guarantees that its category exists.

`cascadeOnDelete` means deleting a category also deletes its menu items. That is powerful and should be used carefully.

## 10. Branch-menu pivot migration

File: `2026_06_14_000004_create_branch_menu_item_table.php`

```php
$table->foreignId('branch_id')->constrained()->cascadeOnDelete();
$table->foreignId('menu_item_id')->constrained()->cascadeOnDelete();
$table->decimal('price', 10, 2);
$table->boolean('is_available')->default(true);
$table->unique(['branch_id', 'menu_item_id']);
```

**What it says:** Connect one branch and one item. Save that branch's price and availability. Allow each pair only once.

**Why it is there:** New Cairo can have a different price from Maadi.

**If price was stored only on MenuItem:** All branches would be forced to share one price.

This connecting table is called a pivot table.

## 11. First orders migration

File: `2026_06_14_000005_create_orders_table.php`

Important lines:

```php
$table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
$table->foreignId('branch_id')->constrained()->cascadeOnDelete();
$table->enum('order_type', ['delivery', 'pickup', 'dine_in']);
$table->decimal('total_price', 10, 2)->default(0);
```

- User can be empty, allowing guest checkout.
- If user is deleted, order stays and user link becomes null.
- Every order needs a branch.
- Type is one of three choices.
- Total stores two decimal places.

Deleting an order's branch currently cascades and deletes its orders. For real financial history, preventing branch deletion or using a soft/inactive branch may be safer.

The original status list was smaller. A later migration changes it.

## 12. Order items migration

File: `2026_06_14_000006_create_order_items_table.php`

```php
$table->foreignId('order_id')->constrained()->cascadeOnDelete();
$table->foreignId('menu_item_id')->constrained()->cascadeOnDelete();
$table->unsignedInteger('quantity');
$table->decimal('price', 10, 2);
```

Each row is one product line.

Price is copied here as a history snapshot.

If today's menu price changes, yesterday's order price stays the same.

Deleting an order deletes its lines.

## 13. Commerce fields migration

File: `2026_09_28_000001_add_commerce_fields.php`

### User role

```php
$table->string('role')->default('customer')->index();
```

Every new user becomes a customer unless code sets another role. The index helps role searches.

### Order additions

```php
$table->string('status')->default('new')->change();
$table->dateTime('pickup_time')->nullable();
$table->string('customer_name')->nullable();
$table->string('customer_phone', 40)->nullable();
$table->text('delivery_address')->nullable();
$table->string('payment_method')->default('cash');
$table->string('payment_status')->default('unpaid')->index();
$table->string('payment_gateway')->nullable();
$table->string('gateway_reference')->nullable()->unique();
$table->string('idempotency_key')->nullable()->unique();
$table->text('status_reason')->nullable();
```

These lines add pickup, customer, payment, and status information.

Unique gateway reference stops two orders sharing one Stripe PaymentIntent.

Unique idempotency key helps stop duplicate checkout creation.

### Old data conversion

```php
DB::table('orders')->where('status', 'pending')->update(['status' => 'new']);
DB::table('orders')->where('status', 'confirmed')->update(['status' => 'accepted']);
```

This changes old status words to the new workflow words.

Without it, old rows could keep unsupported statuses.

### Notes

```php
$table->string('notes', 200)->nullable();
```

This adds optional kitchen notes to order lines.

The `down` method removes the added fields. It does not fully restore the old status column type, so rollback is not a perfect reverse.

## 14. Status log migration

File: `2026_09_28_000002_create_order_status_logs_table.php`

```php
$table->foreignId('order_id')->constrained()->cascadeOnDelete();
$table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
$table->string('from_status')->nullable();
$table->string('to_status');
$table->text('reason')->nullable();
$table->timestamp('created_at')->useCurrent();
```

This records every status change.

Actor can be empty for an automatic change from Stripe.

If a staff user is deleted, the history stays but actor link becomes null.

## 15. Models: shared pattern

A model represents one table.

Example from `app/Models/Category.php`:

```php
class Category extends Model
{
    protected $fillable = ['name', 'slug'];

    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }
}
```

**What it says:** Category is a database model. Name/slug may be filled. One category has many menu items.

**Why it is there:** Laravel can use `$category->menuItems` instead of hand-writing every join.

**If you delete the relationship:** Code cannot use that Eloquent relationship.

## 16. `app/Models/Branch.php`

`$fillable` allows name and location.

```php
return $this->belongsToMany(MenuItem::class)
    ->withPivot(['price', 'is_available'])
    ->withTimestamps();
```

This says branches and items have many-to-many links. Include price and availability from the pivot.

The `orders()` relationship says one branch has many orders.

## 17. `app/Models/MenuItem.php`

- `category()` says each item belongs to one category.
- `branches()` gives all linked branches and pivot values.
- `orderItems()` gives all historical order lines using this item.

Deleting a relationship does not delete database data, but code using that relationship breaks.

## 18. `app/Models/Order.php`

### Status constants

```php
public const STATUS_NEW = 'new';
public const STATUS_ACCEPTED = 'accepted';
public const STATUS_PREPARING = 'preparing';
```

Named constants reduce spelling mistakes and give status words one home.

### Transition map

```php
public const TRANSITIONS = [
    self::STATUS_NEW => [self::STATUS_ACCEPTED, self::STATUS_REJECTED, self::STATUS_CANCELLED],
    self::STATUS_ACCEPTED => [self::STATUS_PREPARING, self::STATUS_CANCELLED],
    self::STATUS_PREPARING => [self::STATUS_READY, self::STATUS_CANCELLED],
];
```

Each current status points to legal next choices.

Deleting this map breaks controller transition checks.

### Fillable and casts

Order's fillable list includes customer, fulfillment, payment, status, and idempotency fields.

```php
protected $casts = [
    'total_price' => 'decimal:2',
    'pickup_time' => 'datetime',
];
```

This keeps total at two decimals and turns pickup time into a date object.

### Relationships

- `user()` belongs to User.
- `branch()` belongs to Branch.
- `items()` has many OrderItems.
- `statusLogs()` has many logs ordered oldest first.

## 19. `app/Models/OrderItem.php`

Fillable fields are order ID, menu item ID, quantity, price, and notes.

Price casts to two decimals.

It belongs to Order and MenuItem.

## 20. `app/Models/OrderStatusLog.php`

```php
public $timestamps = false;
```

The table has `created_at` but no `updated_at`, so automatic two-column timestamps are disabled.

The model casts `created_at` to a date and belongs to Order and User.

## 21. `app/Models/User.php`

User was explained in the login lesson.

Its database relationships add `orders()`. Its `isStaff()` helper accepts staff and admin.

## 22. Seeders

Seeders put starting data into the database.

### `database/seeders/DatabaseSeeder.php`

```php
$this->call(MenuCatalogSeeder::class);
$this->call(StaffUserSeeder::class);
```

It runs menu data first and staff user second.

Delete one line and that seed group is not created by normal database seeding.

### `MenuCatalogSeeder.php`

It creates three branches and five categories with `upsert`.

`upsert` means insert missing rows or update existing rows using a chosen key.

The `$items` list contains item ID, category ID, name, description, and base price.

`$branchMultipliers` changes prices by branch.

`$unavailable` lists products missing from each branch.

Nested loops build every pivot row.

Then another `upsert` writes branch/item price and availability.

If you delete this seeder, fresh databases have no demo menu.

One item description contains a broken text encoding for “jalapeño.” This should be corrected in a future cleanup.

### `StaffUserSeeder.php`

```php
User::updateOrCreate(
    ['email' => env('STAFF_EMAIL', 'staff@whatthecrust.test')],
    [
        'name' => env('STAFF_NAME', 'What The Crust Staff'),
        'password' => env('STAFF_PASSWORD', 'ChangeMe123!'),
        'role' => 'staff',
    ],
);
```

It finds or creates one staff user using environment settings.

User's hashed cast protects the assigned password.

Never keep the example password in a real production server.

## 23. `database/factories/UserFactory.php`

A factory makes fake users for tests.

```php
return [
    'name' => fake()->name(),
    'email' => fake()->unique()->safeEmail(),
    'email_verified_at' => now(),
    'password' => static::$password ??= Hash::make('password'),
    'remember_token' => Str::random(10),
];
```

It creates a fake name, unique safe email, verified time, reused test password hash, and random remember token.

Reusing the hash makes tests faster.

The `unverified()` method changes verification time to null for tests needing an unverified user.

## What you should remember

- SQLite stores this local database in one file.
- Migrations build and change tables; models let PHP work with table rows.
- Foreign keys and relationships connect users, branches, menu items, and orders.
- The pivot table stores each branch's price and availability.
- Seeders make starting data; factories make temporary test data.

## Test yourself

1. Why is price on `branch_menu_item`?
2. Why does OrderItem save its own price?
3. What does a migration's `down()` method do?
4. What is the difference between a seeder and factory?
5. Which file holds the local SQLite data?

## Answers

1. Different branches can charge different prices for the same item.
2. It keeps the historical price even when the menu changes later.
3. It tries to undo the migration's database change.
4. A seeder creates starting/demo data. A factory creates fake records mainly for tests.
5. `database/database.sqlite`.
